import { useEffect, useState } from "react";
import type { InventoryItem, TriggeredAction } from "../types/maestro";
import { evaluateScenario } from "../api/maestro";
import { scenarioPresets } from "../data/scenarioPresets";

type Scenario = {
  id: number;
  name: string;
  items: InventoryItem[];
};

export default function ScenarioManager() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [newScenarioName, setNewScenarioName] = useState("");
  const [newItems, setNewItems] = useState<InventoryItem[]>([]);
  const [results, setResults] = useState<TriggeredAction[]>([]);
  const [, setScenarioItems] = useState<InventoryItem[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const saved = localStorage.getItem("scenarios");
    if (saved) {
      try {
        setScenarios(JSON.parse(saved));
      } catch {
        console.warn("Failed to parse saved scenarios");
      }
    }
  }, []);
  {
    scenarios.map((s) => (
      <div key={s.id} style={{ marginBottom: "1rem" }}>
        <strong>{s.name}</strong>
        <button onClick={() => handleEvaluate(s.items)}>Evaluate</button>
        <button onClick={() => deleteScenario(s.id)}>Delete</button>
      </div>
    ));
  }

  useEffect(() => {
    localStorage.setItem("scenarios", JSON.stringify(scenarios));
  }, [scenarios]);

  const addItem = () => {
    setNewItems([
      ...newItems,
      { sku: "", name: "", quantity: 0, threshold: 0, leadTimeDays: 0 },
    ]);
  };

  type InventoryField = keyof InventoryItem;

  const updateItem = (
    index: number,
    field: InventoryField,
    value: string | number
  ) => {
    const updated = [...newItems];

    if (field === "sku" || field === "name") {
      updated[index] = {
        ...updated[index],
        [field]: value as string,
      };
    } else {
      updated[index] = {
        ...updated[index],
        [field]: Number(value) as InventoryItem[typeof field],
      };
    }

    setNewItems(updated);
  };

  const saveScenario = () => {
    if (!newScenarioName.trim()) return;
    const newScenario: Scenario = {
      id: Date.now(),
      name: newScenarioName.trim(),
      items: newItems,
    };
    setScenarios([...scenarios, newScenario]);
    setNewScenarioName("");
    setNewItems([]);
    setResults([]);
  };

  const handleEvaluate = async (items: InventoryItem[]) => {
    try {
      const res = await evaluateScenario({ items });
      setResults(res.actions);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to evaluate scenario.");
    }
  };
  const handlePresetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const preset = Object.values(scenarioPresets).find(
      (p) => p.name === event.target.value
    );

    if (preset) {
      setScenarioItems(preset.items);
      handleEvaluate(preset.items);
    }
  };
  const deleteScenario = (id: number) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Scenario Manager</h2>
      <select onChange={handlePresetChange}>
        <option value="">Choose a preset</option>
        {Object.values(scenarioPresets).map((preset) => (
          <option key={preset.name} value={preset.name}>
            {preset.name}
          </option>
        ))}
      </select>

      <section style={{ marginBottom: "2rem" }}>
        <h3>Create New Scenario</h3>
        <input
          placeholder="Scenario Name"
          value={newScenarioName}
          onChange={(e) => setNewScenarioName(e.target.value)}
        />
        {newItems.map((item, idx) => (
          <div
            key={idx}
            style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem" }}
          >
            <input
              placeholder="SKU"
              value={item.sku}
              onChange={(e) => updateItem(idx, "sku", e.target.value)}
            />
            <input
              placeholder="Name"
              value={item.name}
              onChange={(e) => updateItem(idx, "name", e.target.value)}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => updateItem(idx, "quantity", e.target.value)}
            />
            <input
              type="number"
              placeholder="Threshold"
              value={item.threshold}
              onChange={(e) => updateItem(idx, "threshold", e.target.value)}
            />
            <input
              type="number"
              placeholder="Lead Time"
              value={item.leadTimeDays}
              onChange={(e) => updateItem(idx, "leadTimeDays", e.target.value)}
            />
          </div>
        ))}
        <button onClick={addItem}>Add Item</button>
        <button onClick={saveScenario}>Save Scenario</button>
      </section>

      <section>
        <h3>Saved Scenarios</h3>
        {scenarios.length === 0 && <p>No scenarios yet.</p>}
        {scenarios.map((s) => (
          <div key={s.id} style={{ marginBottom: "1rem" }}>
            <strong>{s.name}</strong>
            <button onClick={() => handleEvaluate(s.items)}>Evaluate</button>
            <button onClick={() => deleteScenario(s.id)}>Delete</button>
          </div>
        ))}
      </section>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {results.length > 0 && (
        <section>
          <h3>Triggered Actions</h3>
          <ul>
            {results.map((a, idx) => (
              <li key={idx}>
                {a.sku} → {a.action} ({a.reason})
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
