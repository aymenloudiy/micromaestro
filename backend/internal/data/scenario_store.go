package data

import (
	"sync"

	"github.com/aymenloudiy/micromaestro/backend/internal/models"
)

var (
	scenarioStore = make(map[string]models.Scenario)
	mu            sync.RWMutex
)

func SaveScenario(s models.Scenario) {
	mu.Lock()
	defer mu.Unlock()
	scenarioStore[s.Name] = s
}

func GetScenario(name string) (models.Scenario, bool) {
	mu.RLock()
	defer mu.RUnlock()
	scenario, exists := scenarioStore[name]
	return scenario, exists
}

func ListScenarios() []models.Scenario {
	mu.RLock()
	defer mu.RUnlock()
	scenarios := make([]models.Scenario, 0, len(scenarioStore))
	for _, s := range scenarioStore {
		scenarios = append(scenarios, s)
	}
	return scenarios
}
