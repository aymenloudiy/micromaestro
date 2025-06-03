import type {
  InventoryItem,
  InventoryList,
  Status,
  TriggeredActions,
} from "../types/maestro";

const BASE_URL = "http://localhost:8080/v1";

export async function getInventory(): Promise<InventoryItem[]> {
  const res = await fetch(`${BASE_URL}/inventory`);
  const data: InventoryList = await res.json();
  return data.items;
}

export async function updateInventory(
  updates: InventoryItem[]
): Promise<Status> {
  const res = await fetch(`${BASE_URL}/inventory`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ updates }),
  });
  return await res.json();
}

export async function evaluateRules(): Promise<TriggeredActions> {
  const res = await fetch(`${BASE_URL}/rules/evaluate`);
  return await res.json();
}
export async function evaluateScenario(scenario: { items: InventoryItem[] }) {
  const res = await fetch(`${BASE_URL}/rules/evaluate-scenario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(scenario),
  });

  return await res.json();
}
export async function getActionHistory() {
  const res = await fetch(`${BASE_URL}/actions/history`);
  if (!res.ok) throw new Error("Failed to fetch action history");
  return await res.json();
}
