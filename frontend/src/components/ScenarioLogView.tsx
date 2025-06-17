import { useState } from "react";
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
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [error, setError] = useState("");

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

  const toggleExpanded = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePresetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const preset = scenarioPresets.find((p) => p.name === event.target.value);
    if (preset) {
      setScenarioItems(preset.items);
    }
  };

  return (
    <div className="p-8">
      <h2>Scenario Manager</h2>

      <select onChange={handlePresetChange}>
        <option value="">Choose a preset</option>
        {scenarioPresets.map((preset, idx) => (
          <option key={idx} value={preset.name}>
            {preset.name}
          </option>
        ))}
      </select>

      <section className="mb-8">
        <h3>Create New Scenario</h3>
        <input
          placeholder="Scenario Name"
          value={newScenarioName}
          onChange={(e) => setNewScenarioName(e.target.value)}
        />
        {newItems.map((item, idx) => (
          <div key={idx} className="flex gap-4 mb-2">
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
              onChange={(e) =>
                updateItem(idx, "quantity", Number(e.target.value))
              }
            />
            <input
              type="number"
              placeholder="Threshold"
              value={item.threshold}
              onChange={(e) =>
                updateItem(idx, "threshold", Number(e.target.value))
              }
            />
            <input
              type="number"
              placeholder="Lead Time"
              value={item.leadTimeDays}
              onChange={(e) =>
                updateItem(idx, "leadTimeDays", Number(e.target.value))
              }
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
          <div key={s.id} className="mb-4 border border-gray-300 p-4">
            <div className="mb-4 border border-gray-300 p-4">
              <strong>{s.name}</strong>
              <div>
                <button onClick={() => handleEvaluate(s.items)}>
                  Evaluate
                </button>
                <button onClick={() => toggleExpanded(s.id)}>
                  {expanded[s.id] ? "Collapse" : "Expand"}
                </button>
              </div>
            </div>

            {expanded[s.id] && (
              <div className="mt-4">
                <h4>Items</h4>
                <ul>
                  {s.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name} (SKU: {item.sku}) — Qty: {item.quantity},
                      Threshold: {item.threshold}, Lead Time:{" "}
                      {item.leadTimeDays} days
                    </li>
                  ))}
                </ul>

                <h4>Actions</h4>
                <ul>
                  {results
                    .filter((a) => s.items.find((i) => i.sku === a.sku))
                    .map((a, idx) => (
                      <li key={idx}>
                        {a.sku} → {a.action} ({a.reason})
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </section>

      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
