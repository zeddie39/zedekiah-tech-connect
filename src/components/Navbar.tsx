
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="w-full py-4 px-6 bg-primary text-white flex items-center justify-between shadow">
    <div className="flex items-center gap-2">
      <span className="font-orbitron font-bold text-xl">Zedekiah</span>
      <span className="text-gray-300 text-sm">Tech Clinic</span>
    </div>
    <div className="flex gap-6">
      <Link to="/" className="hover:underline">Home</Link>
      <Link to="/dashboard" className="hover:underline">Dashboard</Link>
      <Link to="/auth" className="hover:underline">Login</Link>
    </div>
  </nav>
);

export default Navbar;
