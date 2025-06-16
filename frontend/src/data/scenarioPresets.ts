import type { InventoryItem } from "../types/maestro";

export type ScenarioPreset = {
  name: string;
  items: InventoryItem[];
};

export const scenarioPresets: ScenarioPreset[] = [
  {
    name: "Shortage Alert",
    items: [
      {
        sku: "A123",
        name: "Widget",
        quantity: 5,
        threshold: 10,
        leadTimeDays: 3,
      },
      {
        sku: "B456",
        name: "Gadget",
        quantity: 20,
        threshold: 15,
        leadTimeDays: 5,
      },
    ],
  },
  {
    name: "Healthy Stock",
    items: [
      {
        sku: "C789",
        name: "Thingamajig",
        quantity: 50,
        threshold: 10,
        leadTimeDays: 2,
      },
    ],
  },
];
