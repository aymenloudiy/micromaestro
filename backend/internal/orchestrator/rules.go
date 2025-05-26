package orchestrator

import (
	"fmt"

	"github.com/aymenloudiy/micromaestro/backend/maestropb"
)

func Evaluate(inventory []*maestropb.InventoryItem) []*maestropb.TriggeredAction {
	var actions []*maestropb.TriggeredAction

	for _, item := range inventory {
		if item.Quantity < item.Threshold {
			actions = append(actions, &maestropb.TriggeredAction{
				Sku:    item.Sku,
				Action: "Reorder",
				Reason: fmt.Sprintf("Quantity %d is below threshold %d", item.Quantity, item.Threshold),
			})
		}
	}

	return actions
}
