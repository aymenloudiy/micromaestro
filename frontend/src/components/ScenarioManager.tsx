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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    updated[index] = {
      ...updated[index],
      [field]:
        field === "sku" || field === "name" ? (value as string) : Number(value),
    };
    setNewItems(updated);
  };

  const validateItems = (): string | null => {
    for (const item of newItems) {
      if (!item.sku.trim() || !item.name.trim()) {
        return "SKU and Name must not be empty.";
      }
      if (
        item.quantity < 0 ||
        item.threshold < 0 ||
        item.leadTimeDays < 0 ||
        Number.isNaN(item.quantity) ||
        Number.isNaN(item.threshold) ||
        Number.isNaN(item.leadTimeDays)
      ) {
        return "Quantity, Threshold, and Lead Time must be valid non-negative numbers.";
      }
    }
    return null;
  };

  const saveScenario = () => {
    const validationError = validateItems();
    if (!newScenarioName.trim()) {
      setError("Scenario name is required.");
      return;
    }
    if (validationError) {
      setError(validationError);
      return;
    }

    const newScenario: Scenario = {
      id: Date.now(),
      name: newScenarioName.trim(),
      items: newItems,
    };
    setScenarios([...scenarios, newScenario]);
    setNewScenarioName("");
    setNewItems([]);
    setResults([]);
    setError("");
  };

  const handleEvaluate = async (items: InventoryItem[]) => {
    try {
      setLoading(true);
      setError("");
      const res = await evaluateScenario({ items });
      setResults(res.actions);
    } catch (err) {
      console.error(err);
      setError("Failed to evaluate scenario.");
    } finally {
      setLoading(false);
    }
  };

  const handlePresetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const preset = scenarioPresets.find((p) => p.name === event.target.value);
    if (preset) {
      setScenarioItems(preset.items);
      setNewItems(preset.items);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Scenario Manager</h2>

      <select onChange={handlePresetChange} className="mb-4 p-2 border">
        <option value="">Choose a preset</option>
        {scenarioPresets.map((p) => (
          <option key={p.name} value={p.name}>
            {p.name}
          </option>
        ))}
      </select>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Create New Scenario</h3>
        <input
          className="border p-2 mb-2 block w-full"
          placeholder="Scenario Name"
          value={newScenarioName}
          onChange={(e) => setNewScenarioName(e.target.value)}
        />
        {newItems.map((item, idx) => (
          <div key={idx} className="grid grid-cols-5 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU
              </label>
              <input
                className="border border-gray-300 rounded p-2 w-full"
                placeholder="SKU"
                value={item.sku}
                onChange={(e) => updateItem(idx, "sku", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                className="border border-gray-300 rounded p-2 w-full"
                placeholder="Name"
                value={item.name}
                onChange={(e) => updateItem(idx, "name", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                className="border border-gray-300 rounded p-2 w-full"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => updateItem(idx, "quantity", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Threshold
              </label>
              <input
                type="number"
                className="border border-gray-300 rounded p-2 w-full"
                placeholder="Threshold"
                value={item.threshold}
                onChange={(e) => updateItem(idx, "threshold", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lead Time
              </label>
              <input
                type="number"
                className="border border-gray-300 rounded p-2 w-full"
                placeholder="Lead Time"
                value={item.leadTimeDays}
                onChange={(e) =>
                  updateItem(idx, "leadTimeDays", e.target.value)
                }
              />
            </div>
          </div>
        ))}

        <div className="flex gap-4">
          <button
            onClick={addItem}
            className="bg-blue-500 text-white px-4 py-1 rounded"
          >
            Add Item
          </button>
          <button
            onClick={saveScenario}
            className="bg-green-600 text-white px-4 py-1 rounded"
          >
            Save Scenario
          </button>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">Saved Scenarios</h3>
        {scenarios.length === 0 && <p>No scenarios yet.</p>}
        {scenarios.map((s) => (
          <div
            key={s.id}
            className="mb-4 border p-4 flex justify-between items-center"
          >
            <strong>{s.name}</strong>
            <button
              onClick={() => handleEvaluate(s.items)}
              className="bg-purple-600 text-white px-4 py-1 rounded"
              disabled={loading}
            >
              {loading ? "Evaluating..." : "Evaluate"}
            </button>
          </div>
        ))}
      </section>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {results.length > 0 && (
        <section className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Triggered Actions</h3>
          <ul className="list-disc pl-6">
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
