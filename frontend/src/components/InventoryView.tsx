import { useEffect, useState } from "react";
import { getInventory } from "../api/maestro";
import type { InventoryItem } from "../types/maestro";

export default function InventoryView() {
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    getInventory().then(setItems);
  }, []);

  return (
    <div>
      <h2>Inventory</h2>
      <ul>
        {items.map((item) => (
          <li key={item.sku}>
            {item.name} — {item.quantity} in stock
          </li>
        ))}
      </ul>
      <button onClick={() => getInventory().then(setItems)}>Refresh</button>
    </div>
  );
}
