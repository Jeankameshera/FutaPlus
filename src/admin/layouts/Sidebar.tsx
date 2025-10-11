import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, FileText, Wrench, CreditCard, Power, Gauge, User } from "lucide-react";

interface SidebarProps {
  userName?: string;
  userRole?: string;
}

const Sidebar = ({ userName = "Utilisateur", userRole = "Administrateur" }: SidebarProps) => {
  const navLinks = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={15} /> },
    { name: "Rôles", path: "/admin/roles", icon: <Users size={15} /> },
    { name: "Services", path: "/admin/services", icon: <Wrench size={15} /> },
    { name: "Factures", path: "/admin/factures", icon: <FileText size={15} /> },
    { name: "Paiements", path: "/admin/paiements", icon: <CreditCard size={15} /> },
    { name: "Compteurs", path: "/admin/compteurs", icon: <Gauge size={15} /> },
  ];

  // Fonction déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    window.location.href = "/login";
  };

  // Générer initiales
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

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
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-500 hover:text-red-700 w-full"
        >
          <Power size={18} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;