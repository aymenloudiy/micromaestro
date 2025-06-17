function Navbar() {
  return (
    <div>
      <nav className="p-4 bg-gray-200 flex gap-4">
        <a href="/inventory">Inventory</a>
        <a href="/scenarios">Scenarios</a>
        <a href="/logs">Logs</a>
      </nav>
    </div>
  );
}
export default Navbar;
