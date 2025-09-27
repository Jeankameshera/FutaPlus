// src/components/BottomNav.jsx
import React from 'react';
import { Home, Layers, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg">
      {/* Conteneur centré qui limite la largeur pour que les boutons restent cadrés */}
      <div className="max-w-lg mx-auto px-4">
        {/* Ici justify-between répartit les 3 boutons sur la largeur du conteneur centré */}
        <div className="flex justify-between items-center py-3">
          
          <button
            onClick={() => navigate('/dashboard')}
            aria-label="Accueil"
            className="flex flex-col items-center text-gray-600 hover:text-orange-600 transition"
          >
            <Home className="w-6 h-6 mb-1" />
            <span className="text-xs">Accueil</span>
          </button>

          <button
            onClick={() => navigate('/ServicesScreen')}
            aria-label="Services"
            className="flex flex-col items-center text-gray-600 hover:text-orange-600 transition"
          >
            <Layers className="w-6 h-6 mb-1" />
            <span className="text-xs">Services</span>
          </button>

          <button
            onClick={() => navigate('/login')}
            aria-label="Déconnexion"
            className="flex flex-col items-center text-gray-600 hover:text-red-600 transition"
          >
            <LogOut className="w-6 h-6 mb-1" />
            <span className="text-xs">Déconnexion</span>
          </button>

        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
