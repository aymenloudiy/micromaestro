package main

import (
	"context"
	"encoding/json"
	"log"
	"net"
	"net/http"

	"github.com/aymenloudiy/micromaestro/backend/internal/data"
	"github.com/aymenloudiy/micromaestro/backend/internal/models"
	"github.com/aymenloudiy/micromaestro/backend/internal/orchestrator"
	"github.com/aymenloudiy/micromaestro/backend/maestropb"
	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type server struct {
	maestropb.UnimplementedMaestroServer
}
var inventory = []*maestropb.InventoryItem{
    {Sku: "A123", Name: "Widget", Quantity: 1, Threshold: 10, LeadTimeDays: 3},
}

func (s *server) GetInventory(ctx context.Context, req *maestropb.Empty) (*maestropb.InventoryList, error) {
    return &maestropb.InventoryList{Items: inventory}, nil
}


func (s *server) UpdateInventory(ctx context.Context, req *maestropb.UpdateRequest) (*maestropb.Status, error) {
    for _, update := range req.Updates {
        for _, item := range inventory {
            if item.Sku == update.Sku {
                item.Quantity = update.Quantity
                item.Threshold = update.Threshold
                item.LeadTimeDays = update.LeadTimeDays
                item.Name = update.Name
            }
        }
    }

    return &maestropb.Status{Ok: true, Message: "Inventory updated"}, nil
}

//TODO: Implement Business logic, maybe make it auto trigger too
//TODO: Maybe more rules here later, might need to separate them to diff functions
func (s *server) EvaluateRules(ctx context.Context, req *maestropb.Empty) (*maestropb.TriggeredActions, error) {
actions := orchestrator.Evaluate(inventory)
orchestrator.AddLog("EvaluateRules", actions)
return &maestropb.TriggeredActions{Actions: actions}, nil

}

func (s *server) EvaluateScenario(ctx context.Context, req *maestropb.InventoryList) (*maestropb.TriggeredActions, error) {
actions := orchestrator.Evaluate(req.Items)
orchestrator.AddLog("EvaluateScenario", actions)
return &maestropb.TriggeredActions{Actions: actions}, nil

}


func main() {
	if err := orchestrator.LoadRules("data/rules.json"); err != nil {
    log.Fatalf("Failed to load rules: %v", err)
	}
	go runGRPC()
	runGateway()
}

func runGRPC() {
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	maestropb.RegisterMaestroServer(s, &server{})

	log.Println("gRPC server listening on :50051")
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve gRPC: %v", err)
	}
}



func runGateway() {
	ctx := context.Background()
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	mux := runtime.NewServeMux()
	opts := []grpc.DialOption{grpc.WithTransportCredentials(insecure.NewCredentials())}

	err := maestropb.RegisterMaestroHandlerFromEndpoint(ctx, mux, "localhost:50051", opts)
	if err != nil {
		log.Fatalf("failed to register gRPC-gateway: %v", err)
	}

	muxWithExtra := http.NewServeMux()
	muxWithExtra.Handle("/", mux)

	muxWithExtra.HandleFunc("/v1/actions/history", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		logs := orchestrator.GetLogs()
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(logs)
	})
muxWithExtra.HandleFunc("/v1/scenarios", func(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var scenario models.Scenario
		if err := json.NewDecoder(r.Body).Decode(&scenario); err != nil {
			http.Error(w, "invalid JSON", http.StatusBadRequest)
			return
		}
		data.SaveScenario(scenario)
		w.WriteHeader(http.StatusCreated)
		return
	}

	if r.Method == http.MethodGet {
		scenarios := data.ListScenarios()
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(scenarios)
		return
	}

	http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
})

	muxWithExtra.HandleFunc("/v1/scenarios/evaluate", func(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var payload struct {
		Name string `json:"name"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "invalid JSON", http.StatusBadRequest)
		return
	}

	scenario, exists := data.GetScenario(payload.Name)
	if !exists {
		http.Error(w, "scenario not found", http.StatusNotFound)
		return
	}

	actions := orchestrator.Evaluate(scenario.Items)
	orchestrator.AddLog("EvaluateSavedScenario:"+payload.Name, actions)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"actions":  actions,
		"scenario": payload.Name,
	})
})

	log.Println("REST gateway listening on :8080")
	if err := http.ListenAndServe(":8080", muxWithExtra); err != nil {
		log.Fatalf("failed to serve HTTP: %v", err)
	}
}


