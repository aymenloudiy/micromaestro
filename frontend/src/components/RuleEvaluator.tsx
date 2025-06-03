import { useState } from "react";
import { evaluateRules } from "../api/maestro";
import type { TriggeredAction } from "../types/maestro";

export default function RuleEvaluator() {
  const [results, setResults] = useState<TriggeredAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEvaluate = async () => {
    try {
      console.log("Evaluate button clicked");
      setLoading(true);
      setError("");
      const response = await evaluateRules();
      console.log("Response:", response);
      setResults(response.actions);
      console.log(response.actions);
    } catch (err) {
      console.error("Evaluate failed", err);
      setError("Failed to evaluate rules.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Rule Evaluation</h2>
      <button onClick={handleEvaluate} disabled={loading}>
        {loading ? "Evaluating..." : "Evaluate Rules"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {results.length > 0 && (
        <ul>
          {results.map((action, i) => (
            <li key={i}>
              <strong>{action.action}</strong> for <code>{action.sku}</code>:{" "}
              {action.reason}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
