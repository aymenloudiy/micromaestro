package main

import (
	"context"
	"log"
	"net"
	"net/http"

	"github.com/aymenloudiy/micromaestro/backend/maestropb"

	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"
)

type server struct {
	maestropb.UnimplementedMaestroServer
}

func (s *server) GetInventory(ctx context.Context, req *maestropb.Empty) (*maestropb.InventoryList, error) {
	return &maestropb.InventoryList{
		Items: []*maestropb.InventoryItem{
			{Sku: "A123", Name: "Widget", Quantity: 50, Threshold: 10, LeadTimeDays: 3},
		},
	}, nil
}

func (s *server) UpdateInventory(ctx context.Context, req *maestropb.UpdateRequest) (*maestropb.Status, error) {
	return &maestropb.Status{Ok: true, Message: "Inventory updated"}, nil
}

func (s *server) EvaluateRules(ctx context.Context, req *maestropb.Empty) (*maestropb.TriggeredActions, error) {
	return &maestropb.TriggeredActions{
		Actions: []*maestropb.TriggeredAction{
			{Sku: "A123", Action: "Reorder", Reason: "Below threshold"},
		},
	}, nil
}

func main() {
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

	opts := []grpc.DialOption{grpc.WithInsecure()}

	err := maestropb.RegisterMaestroHandlerFromEndpoint(ctx, mux, "localhost:50051", opts)
	if err != nil {
		log.Fatalf("failed to register gRPC-gateway: %v", err)
	}

	log.Println("REST gateway listening on :8080")
	if err := http.ListenAndServe(":8080", mux); err != nil {
		log.Fatalf("failed to serve HTTP: %v", err)
	}
}
