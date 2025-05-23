import { useEffect, useState } from "react";
import { getInventory, updateInventory } from "../api/maestro";
import type { InventoryItem } from "../types/maestro";

export default function InventoryEditor() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    getInventory().then(setItems);
  }, []);

  const handleChange = (index: number, value: number) => {
    const updated = [...items];
    updated[index].quantity = value;
    setItems(updated);
  };

  const handleSubmit = async () => {
    const res = await updateInventory(items);
    setStatusMsg(res.message);
  };

  return (
    <div>
      <h2>Inventory Editor</h2>
      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Name</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={item.sku}>
              <td>{item.sku}</td>
              <td>{item.name}</td>
              <td>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleChange(i, parseInt(e.target.value, 10))
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSubmit}>Update Inventory</button>
      {statusMsg && <p>{statusMsg}</p>}
    </div>
  );
}
