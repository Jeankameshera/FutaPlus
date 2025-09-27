import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RegidesoForm from '@/services/RegidesoForm';
import ObrForm from '@/services/ObrForm';
import OnatelForm from '@/services/OnatelForm';
import CashPowerForm from '@/services/CashPowerForm';

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Ici on peut faire un switch ou un mapping pour afficher le bon formulaire
  const renderForm = () => {
    switch (id) {
      case '1':
        return <RegidesoForm />;
      case '2':
        return <CashPowerForm />;
      
      case '3':
        return <ObrForm />;
      case '4':
        return <OnatelForm />;
      

        
      // ajoute les autres services ici


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
