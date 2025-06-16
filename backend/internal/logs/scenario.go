package logs

import (
	"sync"

	"github.com/aymenloudiy/micromaestro/backend/maestropb"
)

type ScenarioLogEntry struct {
	Name     string                    `json:"name"`
	Items    []*maestropb.InventoryItem `json:"items"`
	Actions  []*maestropb.TriggeredAction `json:"actions"`
}

var (
	scenarioLog []ScenarioLogEntry
	mu          sync.Mutex
)

func AddScenarioLog(entry ScenarioLogEntry) {
	mu.Lock()
	defer mu.Unlock()
	scenarioLog = append(scenarioLog, entry)
}

func GetScenarioLogs() []ScenarioLogEntry {
	mu.Lock()
	defer mu.Unlock()
	return append([]ScenarioLogEntry(nil), scenarioLog...) 
}
