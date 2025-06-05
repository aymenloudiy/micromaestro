package models

import "github.com/aymenloudiy/micromaestro/backend/maestropb"

type Scenario struct {
	Name   string                   `json:"name"`
	Items  []*maestropb.InventoryItem `json:"items"`
}
