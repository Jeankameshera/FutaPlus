import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Bell,
  Menu,
  X,
  Home,
  CreditCard,
  History,
  User,
  LogOut,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    toast({
      title: 'Déconnexion réussie',
      description: 'À bientôt !',
    });
    navigate('/login');
  };

  const isActiveRoute = (path: string) => location.pathname === path;

  const handleBack = () => navigate(-1);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // Ferme le menu si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Accueil' },
    { path: '/services', icon: CreditCard, label: 'Services' },
    { path: '/history', icon: History, label: 'Historique' },
    { path: '/profile', icon: User, label: 'Profil' },
  ];

  return (
    <>
      

          {/* Menu pop-up */}
          {menuOpen && (
            <div
              ref={menuRef}
              className="absolute top-12 right-0 bg-white text-black rounded shadow-lg z-50 w-56"
            >
              <nav className="flex flex-col p-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded hover:bg-gray-100 ${
                      isActiveRoute(item.path) ? 'bg-gray-200' : ''
                    }`}
                  >
                    <item.icon className="mr-3" size={18} />
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center px-3 py-2 rounded hover:bg-gray-100 text-left w-full"
                >
                  <LogOut className="mr-3" size={18} />
                  Déconnexion
                </button>
              </nav>
            </div>
          )}

      {/* Contenu principal */}
      <main className="min-h-screen bg-gray-50 p-4">{children}</main>
    </>
  );
};

export default Layout;
