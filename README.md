# MicroMaestro

A lightweight, modular supply chain orchestration tool inspired by Kinaxis Maestro. MicroMaestro automates basic supply chain decisions using a rule-based engine, real-time data inputs, and gRPC-based communication between a Go backend and a React frontend.

---

## 📌 Project Overview

**MicroMaestro** simulates supply chain automation and decision-making with:

- 📦 Inventory data ingestion (CSV or JSON)
- 🤖 Rule engine for automated decision triggers
- 📈 Scenario simulation to model what-if cases
- 📊 Interactive dashboard built with React
- 🔗 gRPC communication between frontend and backend

---

## 🧱 Architecture

- **Frontend**: React + TypeScript
- **Backend**: Go + gRPC
- **Communication**: Protocol Buffers
- **Data Storage**: In-memory (with option for SQLite/PostgreSQL later)

```
frontend/          # React dashboard + gRPC client
backend/
  cmd/server       # Main Go entry point
  internal/
    orchestrator/  # Rule engine logic
    grpc/          # gRPC server implementation
    data/          # Inventory data handling
    models/        # Data types
proto/             # Shared gRPC .proto files
```

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/micromaestro.git
cd micromaestro
```

### 2. Install Dependencies

#### Backend (Go)

```bash
cd backend
go mod tidy
```

#### Frontend (React)

```bash
cd frontend
npm install
```

### 3. Generate gRPC Code

Using `protoc` or `buf`:

```bash
# Generate Go code
protoc --go_out=backend/internal/grpc --go-grpc_out=backend/internal/grpc proto/maestro.proto

# Generate TypeScript code (via ts-proto or @bufbuild/protobuf)
# Example using buf:
buf generate
```

### 4. Run the Backend

```bash
cd backend/cmd/server
go run main.go
```

### 5. Run the Frontend

```bash
cd frontend
npm run dev
```

---

## 🧠 Example Rule

```json
{
  "condition": "item.quantity < item.threshold && item.lead_time_days > 5",
  "action": "generate_replenishment_order",
  "reason": "Low stock and long lead time"
}
```

---

## 📡 gRPC API Overview

- `GetInventory() → InventoryList`
- `UpdateInventory(UpdateRequest) → Status`
- `EvaluateRules() → TriggeredActions`

Proto definitions are located in [`proto/maestro.proto`](./proto/maestro.proto).

---

## 🛠️ Roadmap

- [ ] Basic gRPC setup
- [ ] CSV/JSON ingestion of inventory data
- [ ] Rule engine for automated decisions
- [ ] Scenario simulation logic
- [ ] Interactive React dashboard
- [ ] Dockerized deployment

---

## 📝 License

MIT License — see `LICENSE` for details.

---

## 👨‍💻 Author

Built by [Aymen Loudiy](https://github.com/aymenloudiy) as a simplified version of Kinaxis Maestro for learning, exploration, or internship application purposes.
