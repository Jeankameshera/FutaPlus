// src/components/Header.tsx
import { Bell, UserCircle, LogOut, Settings, Sun, Moon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/api/api";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [notifications, setNotifications] = useState(3);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150');
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const BASE_URL = 'http://localhost:8000';

  // Charger les données utilisateur au montage
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        toast({
          title: 'Erreur',
          description: 'Aucun token d’authentification trouvé. Veuillez vous reconnecter.',
          variant: 'destructive',
        });
        navigate('/login');
        return;
      }

      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const userId = tokenData.sub;
        const userResponse = await api.get(`/user/${userId}`);

        // Données utilisateur
        if (userResponse.data.id) {
          setFirstName(userResponse.data.first_name || '');
          setLastName(userResponse.data.last_name || '');
          setProfileImage(
            userResponse.data.profile_image
              ? `${BASE_URL}${userResponse.data.profile_image}`
              : 'https://via.placeholder.com/150'
          );
          setUserRole(userResponse.data.role || 'admin');
        } else {
          throw new Error(userResponse.data.error || 'Failed to load user data');
        }
      } catch (err: any) {
        console.error('Error fetching user data:', err);
        let errorMessage = err.response?.data?.error || 'Impossible de charger les données utilisateur';
        toast({
          title: 'Erreur',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, toast]);

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
  const getInitials = () => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  // Fonction déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  if (loading) {
    return (
      <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Tableau de bord Admin
        </h1>
        <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
      </header>
    );
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex justify-between items-center transition-colors">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Tableau de bord Admin
      </h1>
 
      <div className="flex items-center gap-4">
        
        {/* Menu utilisateur */}
        <div className="relative" ref={userMenuRef}>
          <button
            className="flex items-center gap-3 text-gray-600 dark:text-gray-200 
            hover:text-orange-500 transition rounded-lg border border-gray-300 dark:border-gray-600 p-2"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            {/* Photo de profil et informations */}
            <div className="flex items-center gap-3">
              <img
                src={profileImage}
                alt="Profil"
                className="w-8 h-8 rounded-full object-cover border border-gray-300"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/150';
                }}
              />
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {firstName} {lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {userRole}
                </p>
              </div>
            </div>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-700 
              border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50">
              {/* En-tête avec informations utilisateur */}
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={profileImage}
                    alt="Profil"
                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/150';
                    }}
                  />
                  <div>
                    <p className="text-gray-800 dark:text-gray-200 font-semibold">
                      {firstName} {lastName}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm capitalize">
                      {userRole}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Menu options */}
              <ul className="py-1">
                <li>
                  <Link
                    to="/profile"
                    className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 
                    hover:bg-orange-50 dark:hover:bg-gray-600 flex items-center gap-2 transition"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <UserCircle size={16} /> Profil
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings"
                    className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200
                     hover:bg-orange-50 dark:hover:bg-gray-600 flex items-center gap-2 transition"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Settings size={16} /> Paramètres
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 
                    dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-600 flex items-center gap-2 transition"
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