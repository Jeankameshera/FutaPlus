
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Service data
const services = [
  { 
    id: 1, 
    name: 'REGIDES O', 
    icon: '💧', 
    description: 'Paiement des factures d\'eau',
    color: 'bg-blue-500'
  },
  { 
    id: 2, 
    name: 'SNEL', 
    icon: '⚡', 
    description: 'Paiement des factures d\'électricité',
    color: 'bg-yellow-500'
  },
  { 
    id: 3, 
    name: 'Vignette Auto', 
    icon: '🚗', 
    description: 'Paiement des vignettes automobiles',
    color: 'bg-green-500'
  },
  { 
    id: 4, 
    name: 'Internet', 
    icon: '🌐', 
    description: 'Paiement des abonnements internet',
    color: 'bg-purple-500'
  },
  { 
    id: 5, 
    name: 'Impôts', 
    icon: '📑', 
    description: 'Paiement des taxes et impôts',
    color: 'bg-red-500'
  },
  { 
    id: 6, 
    name: 'Transport', 
    icon: '🚌', 
    description: 'Paiement des services de transport',
    color: 'bg-indigo-500'
  }
];

const Services = () => {
  const navigate = useNavigate();

  return (
    <Layout title="Services">
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Services de paiement</h1>
          <p className="text-gray-600">Sélectionnez un service pour effectuer un paiement</p>
        </div>

        <div className="mb-6 relative">
          <Input 
            placeholder="Rechercher un service..." 
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <Card 
              key={service.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/service/${service.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full ${service.color} flex items-center justify-center text-white text-xl mr-4`}>
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{service.name}</h3>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="w-full"
          >
            Retour au tableau de bord
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Services;
