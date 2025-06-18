import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./components/Layout";
import ScenarioManager from "./components/ScenarioManager";
import ActionHistoryView from "./components/ActionHistoryView";
import Home from "./pages/Home";
import InventoryDashboard from "./components/InventoryDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="inventory" element={<InventoryDashboard />} />
          <Route path="scenarios" element={<ScenarioManager />} />
          <Route path="history" element={<ActionHistoryView />} />
          <Route path="*" element={<div>Page not found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
