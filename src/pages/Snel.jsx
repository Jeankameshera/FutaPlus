import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowRight, Home, FileText, User, Settings } from 'lucide-react';

// === Composant de navigation basse  ===
const BottomNav = () => {
  const navigate = useNavigate();
  

  const navItems = [
    { label: 'Accueil', icon: Home, route: '/dashboard' },
    { label: 'Services', icon: FileText, route: '/services' },
    { label: 'Compte', icon: User, route: '/profile' },
    { label: 'Paramètres', icon: Settings, route: '/settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-center py-2 shadow-sm sm:hidden z-50">
      {navItems.map((item, index) => (
        <button
          key={index}
          onClick={() => navigate(item.route)}
          className="flex flex-col items-center text-gray-600 hover:text-orange-600"
        >
          <item.icon size={20} />
          <span className="text-xs mt-1">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

// === Composant principal Regideso ===
const Regideso = () => {
  const navigate = useNavigate();

  return (
    <Layout title="Service REGIDESO">
      {/* === Header sticky réutilisé du Dashboard === */}
      <div className="sticky top-0 z-40 bg-white shadow-xl p-5 flex items-center gap-3">
        {/* Avatar ou initiales */}
        

        {/* Nom  et desc */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold">SNEL</h2>
          <p className="text-sm text-gray-600">Paiement des factures d'électricité</p>
        </div>      
      </div>

      {/* === Corps de la page (à remplir plus tard) === */}
      <div className="pb-24 pt-6 max-w-4xl mx-auto">
        {/* 💡 Contenu à venir ici (formulaire ou infos spécifiques à REGIDESO) */}
      </div>

      {/* === Navigation basse (fixe) === */}
      <BottomNav />
    </Layout>
  );
};

export default Regideso;
