import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./components/Layout";
import InventoryView from "./components/InventoryView";
import ScenarioManager from "./components/ScenarioManager";
import ActionHistoryView from "./components/ActionHistoryView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<InventoryView />} />
          <Route path="/scenarios" element={<ScenarioManager />} />
          <Route path="/history" element={<ActionHistoryView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
