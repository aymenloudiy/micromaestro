import { Link } from "react-router";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-4xl w-full p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-4 text-center text-blue-700">
          microMaestro
        </h1>
        <p className="text-gray-600 text-center mb-8">
          A simplified scenario engine inspired by Kinaxis Maestro. Manage
          inventory, evaluate rule-based actions, and simulate what-if
          scenarios.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/inventory"
            className="p-6 bg-blue-100 hover:bg-blue-200 rounded-lg text-center shadow transition"
          >
            <h2 className="text-xl font-semibold text-blue-800 mb-2">
              Inventory
            </h2>
            <p className="text-sm text-gray-600">
              View and update your inventory data
            </p>
          </Link>

          <Link
            to="/scenarios"
            className="p-6 bg-green-100 hover:bg-green-200 rounded-lg text-center shadow transition"
          >
            <h2 className="text-xl font-semibold text-green-800 mb-2">
              Scenarios
            </h2>
            <p className="text-sm text-gray-600">
              Run simulations and test inventory triggers
            </p>
          </Link>

          <Link
            to="/history"
            className="p-6 bg-purple-100 hover:bg-purple-200 rounded-lg text-center shadow transition"
          >
            <h2 className="text-xl font-semibold text-purple-800 mb-2">
              Action History
            </h2>
            <p className="text-sm text-gray-600">
              Review past triggered actions
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
