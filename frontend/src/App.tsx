import "./App.css";
import InventoryView from "./components/InventoryView";
import InventoryEditor from "./components/InventoryEditor";
import RuleEvaluator from "./components/RuleEvaluator";
import ScenarioSimulator from "./pages/ScenarioSimulator";
import ScenarioView from "./components/ScenarioView";

function App() {
  return (
    <>
      <InventoryView />
      <InventoryEditor />
      <RuleEvaluator />
      <ScenarioSimulator />
      <ScenarioView />
    </>
  );
}

export default App;
