import { NavLink } from "react-router";

const Navbar = () => {
  const linkStyle =
    "px-4 py-2 text-sm font-medium hover:text-blue-500 transition-colors";
  const activeStyle = "text-blue-600 border-b-2 border-blue-600";

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between">
      <h1 className="text-lg font-bold text-gray-800">microMaestro</h1>
      <div className="flex gap-4">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeStyle : "text-gray-600"}`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="inventory"
          end
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeStyle : "text-gray-600"}`
          }
        >
          Inventory
        </NavLink>
        <NavLink
          to="/scenarios"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeStyle : "text-gray-600"}`
          }
        >
          Scenarios
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeStyle : "text-gray-600"}`
          }
        >
          Action History
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
