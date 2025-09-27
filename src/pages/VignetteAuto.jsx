import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import BottomNav from '@/components/BottomNav';
import { ArrowRight, Home, FileText, User, Settings } from 'lucide-react';

// === Composant de navigation basse (identique à Dashboard) ===


  

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
          <h2 className="text-lg font-semibold">Vignette Auto</h2>
          <p className="text-sm text-gray-600">Paiement des vignettes automobiles</p>
        </div>      
      </div>

      {/* === Corps de la page (à remplir plus tard) === */}
      <div className="pb-24 pt-6 max-w-4xl mx-auto">

        {/*  Contenu pour les information de la vignette  */}
      </div>
      

      {/* === Navigation basse (fixe) === */}
      <BottomNav />
    </Layout>
  );
};

export default Regideso;
