package orchestrator

import (
	"sync"
	"time"

	"github.com/aymenloudiy/micromaestro/backend/maestropb"
)

type TriggeredLog struct {
	Timestamp time.Time `json:"timestamp"`
	Source    string    `json:"source"`
	Action    *maestropb.TriggeredAction
}

var (
	logs []TriggeredLog
	mu   sync.Mutex
)

func AddLog(source string, actions []*maestropb.TriggeredAction) {
	mu.Lock()
	defer mu.Unlock()

	t := time.Now()
	for _, a := range actions {
		logs = append(logs, TriggeredLog{
			Timestamp: t,
			Source:    source,
			Action:    a,
		})
	}
}

func GetLogs() []TriggeredLog {
	mu.Lock()
	defer mu.Unlock()
	return append([]TriggeredLog(nil), logs...) 
}
