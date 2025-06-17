import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import InventoryView from "./components/InventoryView";
import ScenarioManager from "./components/ScenarioManager";
import ActionHistoryView from "./components/ActionHistoryView";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/inventory" replace />} />
        <Route path="/inventory" element={<InventoryView />} />
        <Route path="/scenarios" element={<ScenarioManager />} />
        <Route path="/logs" element={<ActionHistoryView />} />
      </Routes>
    </Router>
  );
}
