// src/pages/ServiceDetail.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RegidesoForm from '@/services/RegidesoForm';
import ObrForm from '@/services/ObrForm';
import CashPowerForm from '@/services/CashPowerForm';
import TvForm from '@/services/TvForm';
import InternetForm from '@/services/InternetForm';
import ImpotForm from '@/services/ImpotForm';
import TransportForm from '../services/TransportForm';
      
const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Ici on peut faire un switch ou un mapping pour afficher le bon formulaire
  const renderForm = () => {
    switch (id) {
      case '1':
        return <RegidesoForm />;  // Formulaire personnalisé pour Regideso
      case '2':
        return <CashPowerForm />;       // Formulaire personnalisé pour Cash Power
      case '3':
        return <InternetForm />;  // Formulaire générique pour Internet
      case '4':
        return <TvForm />;  // Formulaire personnalisé pour Tv
      case '5':
        return <ImpotForm />;  // Formulaire personnalisé pour l'impot
      case '6':
        return <ObrForm />;  // Formulaire personnalisé pour vignette               
      case '7':
        return <TransportForm />; // Formulaire générique pour transport        
      


      default:        
        return <p>Service non trouvé</p>;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <button
        className="absolute top-4 left-4 flex items-center text-orange-500
         hover:text-orange-600 transition"
        onClick={() => navigate(-1)} // Retour à la page précédente
      >
        <span className="font-semibold text-md">Retour</span>
      </button>
      {renderForm()}
    </div>
  );
}

  export default ServiceDetail;
