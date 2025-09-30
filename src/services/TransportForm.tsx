import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';

const TransportForm: React.FC = () => {
  return (
    <div className="flex flex-col justify-between min-h-screen">
      <div className="p-6 text-center flex-grow flex items-center justify-center">
        <div>
          <h2 className="text-2xl font-bold text-orange-600">Service Indisponible</h2>
          <p className="mt-4 text-gray-600">
            Le service <strong>Transport</strong> n’est pas encore disponible sur FUTA+.  
            Nous travaillons activement pour l’intégrer très bientôt afin de vous offrir une
            expérience complète et pratique.
          </p>
          <p className="mt-2 text-gray-500 italic">
            Merci pour votre patience et votre confiance ! 
          </p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default TransportForm;
