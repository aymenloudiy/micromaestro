import { useState } from "react";
import { evaluateScenario } from "../api/maestro";
import type { InventoryItem, TriggeredAction } from "../types/maestro";

const defaultScenario: InventoryItem[] = [
  {
    sku: "A001",
    name: "Test Widget",
    quantity: 4,
    threshold: 10,
    leadTimeDays: 3,
  },
];

export default function ScenarioSimulator() {
  const [scenario, setScenario] = useState<InventoryItem[]>(defaultScenario);
  const [results, setResults] = useState<TriggeredAction[]>([]);
  const [error, setError] = useState("");

  const handleChange = (
    i: number,
    field: keyof InventoryItem,
    value: string
  ) => {
    const newScenario = [...scenario];
    const item = {
      ...newScenario[i],
      [field]: field === "name" || field === "sku" ? value : Number(value),
    };
    newScenario[i] = item;
    setScenario(newScenario);
  };

  const handleEvaluate = async () => {
    try {
      setError("");
      const response = await evaluateScenario({ items: scenario });
      setResults(response.actions);
    } catch {
      setError("Failed to evaluate scenario.");
    }
  };

  return (
    <div>
      <h2>Scenario Simulator</h2>

      {scenario.map((item, i) => (
        <div key={i} style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="SKU"
            value={item.sku}
            onChange={(e) => handleChange(i, "sku", e.target.value)}
          />
          <input
            type="text"
            placeholder="Name"
            value={item.name}
            onChange={(e) => handleChange(i, "name", e.target.value)}
          />
          <input
            type="number"
            placeholder="Qty"
            value={item.quantity}
            onChange={(e) => handleChange(i, "quantity", e.target.value)}
          />
          <input
            type="number"
            placeholder="Threshold"
            value={item.threshold}
            onChange={(e) => handleChange(i, "threshold", e.target.value)}
          />
          <input
            type="number"
            placeholder="Lead Time"
            value={item.leadTimeDays}
            onChange={(e) => handleChange(i, "leadTimeDays", e.target.value)}
          />
        </div>
      ))}

      <button onClick={handleEvaluate}>Run Scenario</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {results.length > 0 && (
        <ul>
          {results.map((a, i) => (
            <li key={i}>
              <strong>{a.action}</strong> for <code>{a.sku}</code>: {a.reason}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
