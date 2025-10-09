import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, FileText, Wrench, CreditCard, Power, Gauge } from "lucide-react";

const Sidebar = () => {
  const navLinks = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={15} /> },
    { name: "Rôles", path: "/admin/roles", icon: <Users size={15} /> },
    { name: "Services", path: "/admin/services", icon: <Wrench size={15} /> },
    { name: "Factures", path: "/admin/factures", icon: <FileText size={15} /> },
    { name: "Paiements", path: "/admin/paiements", icon: <CreditCard size={15} /> },
    { name: "Compteurs", path: "/admin/compteurs", icon: <Gauge size={15} /> },
  ];

  return (
    <aside className="w-50 bg-white shadow-md flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
          <h1 className="text-4xl font-extrabold text-orange-600">FuTa+</h1>        
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-sm text-gray-700 hover:bg-orange-100 transition ${
                isActive ? "bg-orange-500 text-white" : ""
              }`
            }
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Déconnexion */}
      <div className="p-4 border-t border-gray-200">
           <NavLink to="/login"
           className="flex items-center gap-6 text-red-500 hover:text-red-700"
          >
              <Power size={18} />Déconnexion </NavLink>
       </div>
    </aside>
  );
};

export default Sidebar;
