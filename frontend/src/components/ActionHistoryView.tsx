import { useEffect, useState } from "react";
import { getActionHistory } from "../api/maestro";

interface TriggeredAction {
  sku: string;
  action: string;
  reason: string;
}

interface ActionLog {
  timestamp: string;
  source: string;
  actions: TriggeredAction[];
}

export default function ActionHistoryView() {
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getActionHistory()
      .then(setLogs)
      .catch((err) => {
        console.error(err);
        setError("Failed to load history.");
      });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Action History</h2>
      {error && <p className="text-red-500">{error}</p>}
      {logs.length === 0 ? (
        <p>No history yet.</p>
      ) : (
        <div className="space-y-4">
          {logs.map((log, idx) => (
            <div key={idx} className="border p-3 rounded shadow">
              <div className="text-gray-600 text-sm mb-2">
                <strong>{log.source}</strong> –{" "}
                {new Date(log.timestamp).toLocaleString()}
              </div>
              <ul className="list-disc pl-6">
                {log.actions.map((a, i) => (
                  <li key={i}>
                    <strong>{a.sku}</strong>: {a.action} – {a.reason}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
