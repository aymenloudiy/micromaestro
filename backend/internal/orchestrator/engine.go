package orchestrator

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/Knetic/govaluate"
	"github.com/aymenloudiy/micromaestro/backend/maestropb"
)

var rules []Rule

func LoadRules(filepath string) error {
	data, err := os.ReadFile(filepath)
	if err != nil {
		return fmt.Errorf("failed to read rules file: %w", err)
	}
	return json.Unmarshal(data, &rules)
}

func Evaluate(inventory []*maestropb.InventoryItem) []*maestropb.TriggeredAction {
	var actions []*maestropb.TriggeredAction

	for _, item := range inventory {
		params := map[string]interface{}{
			"quantity":      item.Quantity,
			"threshold":     item.Threshold,
			"leadTimeDays":  item.LeadTimeDays,
			"name":          item.Name,
			"sku":           item.Sku,
		}

		for _, rule := range rules {
			expr, err := govaluate.NewEvaluableExpression(rule.Condition)
			if err != nil {
				continue
			}

			result, err := expr.Evaluate(params)
			if err == nil && result == true {
				actions = append(actions, &maestropb.TriggeredAction{
					Sku:    item.Sku,
					Action: rule.Action,
					Reason: rule.Reason,
				})
			}
		}
	}

	return actions
}
