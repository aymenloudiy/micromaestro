export interface InventoryItem {
  sku: string;
  name: string;
  quantity: number;
  threshold: number;
  leadTimeDays: number;
}

export interface InventoryList {
  items: InventoryItem[];
}

export interface UpdateRequest {
  updates: InventoryItem[];
}

export interface Status {
  ok: boolean;
  message: string;
}

export interface TriggeredAction {
  sku: string;
  action: string;
  reason: string;
}

export interface TriggeredActions {
  actions: TriggeredAction[];
}
