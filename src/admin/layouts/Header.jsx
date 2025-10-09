import { Bell, UserCircle, LogOut, Settings, Sun, Moon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ userName = "Jean Kameshera", userRole = "Administrateur" }) => {
  const [notifications, setNotifications] = useState(3);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  // Fermer menu si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

   // Générer initiales
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Fonction déconnexion
  const handleLogout = () => {
    // Exemple : supprimer token, rediriger vers login
    console.log("Déconnexion...");
    navigate("/login");
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex justify-between items-center transition-colors">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200 ">
        Tableau de bord Admin
      </h1>
 
      <div className="flex items-center gap-4">
        
        {/* Menu utilisateur */}
        <div className="relative" ref={userMenuRef}>
          <button
            className="flex items-center gap-2 text-gray-600 dark:text-gray-200 
            hover:text-orange-500 transition rounded-full border border-gray-300 dark:border-gray-600 p-1"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <div className="w-8 h-8 flex items-center justify-center bg-orange-500 text-white 
            rounded-full text-sm font-semibold">
              {getInitials(userName)}
            </div>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-700 
              border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                <p className="text-gray-800 dark:text-gray-200 font-semibold">{userName}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{userRole}</p>
              </div>
              <ul className="py-1">
                <li>
                  <Link
                    to="/profile"
                    className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 
                    hover:bg-orange-500 dark:hover:bg-gray-600 flex items-center gap-2"
                  >
                    <UserCircle size={16} /> Profil
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings"
                    className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200
                     hover:bg-orange-500 dark:hover:bg-gray-600 flex items-center gap-2"
                  >
                    <Settings size={16} /> Paramètres
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 
                    dark:text-gray-200 hover:bg-orange-500 dark:hover:bg-gray-600 flex items-center gap-2"
                  >
                    <LogOut size={16} /> Déconnexion
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
