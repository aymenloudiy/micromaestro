import "./App.css";
import InventoryView from "./components/InventoryView";
import InventoryEditor from "./components/InventoryEditor";
import RuleEvaluator from "./components/RuleEvaluator";

function App() {
  return (
    <>
      <InventoryView />
      <InventoryEditor />
      <RuleEvaluator />
    </>
  );
}

export default App;
