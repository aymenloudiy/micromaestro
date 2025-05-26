package orchestrator

type Rule struct {
	Name      string `json:"name"`
	Condition string `json:"condition"`
	Action    string `json:"action"`
	Reason    string `json:"reason"`
	Priority  int    `json:"priority"`
}
