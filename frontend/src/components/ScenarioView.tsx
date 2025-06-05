import { useEffect, useState } from "react";
import type { InventoryItem, TriggeredAction } from "../types/maestro";
import { evaluateScenario } from "../api/maestro";

export default function ScenarioView() {
  const [scenario, setScenario] = useState<InventoryItem[]>([]);
  const [results, setResults] = useState<TriggeredAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const initial: InventoryItem[] = [
      {
        sku: "A123",
        name: "Widget",
        quantity: 50,
        threshold: 10,
        leadTimeDays: 3,
      },
      {
        sku: "B456",
        name: "Thing",
        quantity: 8,
        threshold: 15,
        leadTimeDays: 5,
      },
    ];
    setScenario(initial);
  }, []);

  const handleChange = (
    index: number,
    field: keyof InventoryItem,
    value: string
  ) => {
    const updated = [...scenario];
    if (field === "sku" || field === "name") {
      updated[index][field] = value;
    } else {
      updated[index][field] = parseInt(value);
    }
    setScenario(updated);
  };

  const handleEvaluate = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await evaluateScenario({ items: scenario });
      setResults(response.actions || []);
    } catch (err) {
      console.error(err);
      setError("Scenario evaluation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Scenario Evaluation</h1>

      {scenario.map((item, index) => (
        <div key={item.sku} className="mb-2 grid grid-cols-5 gap-2">
          <input
            className="border p-1"
            value={item.sku}
            onChange={(e) => handleChange(index, "sku", e.target.value)}
          />
          <input
            className="border p-1"
            value={item.name}
            onChange={(e) => handleChange(index, "name", e.target.value)}
          />
          <input
            className="border p-1"
            value={item.quantity}
            type="number"
            onChange={(e) => handleChange(index, "quantity", e.target.value)}
          />
          <input
            className="border p-1"
            value={item.threshold}
            type="number"
            onChange={(e) => handleChange(index, "threshold", e.target.value)}
          />
          <input
            className="border p-1"
            value={item.leadTimeDays}
            type="number"
            onChange={(e) =>
              handleChange(index, "leadTimeDays", e.target.value)
            }
          />
        </div>
      ))}

      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleEvaluate}
        disabled={loading}
      >
        {loading ? "Evaluating..." : "Evaluate Scenario"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {results.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Triggered Actions</h2>
          <ul className="list-disc ml-6">
            {results.map((action, idx) => (
              <li key={idx}>
                {action.sku} – {action.action} ({action.reason})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
