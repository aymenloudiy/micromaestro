import { useEffect, useState } from "react";
import { getInventory } from "../api/maestro";
import type { InventoryItem } from "../types/maestro";

export default function InventoryDashboard() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await getInventory();
      setInventory(res);
    } catch (err) {
      console.error(err);
      setError("Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  };
  const getStatusBadge = (item: InventoryItem) => {
    const isLow = item.quantity <= item.threshold;
    return (
      <span
        className={`inline-block px-2 py-1 rounded text-xs font-bold ${
          isLow ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
        }`}
      >
        {isLow ? "Low Stock" : "In Stock"}
      </span>
    );
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Inventory Dashboard</h2>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={fetchInventory}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Refreshing..." : "Refresh"}
      </button>

      {!loading && !error && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {inventory.map((item) => (
            <div
              key={item.sku}
              className="border border-gray-300 rounded shadow-sm p-4 flex flex-col gap-2"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {item.name}
              </h3>
              <div className="text-sm text-gray-600">SKU: {item.sku}</div>
              <div className="text-sm">
                <strong>Quantity:</strong> {item.quantity}
              </div>
              <div className="text-sm">
                <strong>Threshold:</strong> {item.threshold}
              </div>
              <div className="text-sm">
                <strong>Lead Time:</strong> {item.leadTimeDays} days
              </div>
              <div>{getStatusBadge(item)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
