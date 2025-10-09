import React, { useState, useCallback, useEffect } from 'react';
import InteractiveCard from '@/components/InteractiveCard';
import SearchBar from '@/components/ui/search-bar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/api';
import { useToast } from '@/hooks/use-toast';

interface PublicService {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
  slug: string;
}

const ServicesScreen: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [services, setServices] = useState<PublicService[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services');
        setServices(response.data);
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les services.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [toast]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (!query) {
      setServices(services);
      return;
    }
    const filteredServices = services.filter((service) =>
      service.name.toLowerCase().includes(query.toLowerCase()) ||
      service.category.toLowerCase().includes(query.toLowerCase()) ||
      service.description.toLowerCase().includes(query.toLowerCase())
    );
    setServices(filteredServices);
  }, [services]);

  const handleCardClick = (service: PublicService) => {
    navigate(`/service-detail/${service.id}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => {
          if (window.history.length > 2) {
            navigate(-1);
          } else {
            navigate('/dashboard');
          }
        }}
      >
        <ArrowLeft size={16} className="mr-2" />
        Retour
      </Button>

      <h1 className="text-2xl font-bold mb-6">Mes Services</h1>

      <SearchBar
        placeholder="Rechercher un service, une catégorie..."
        onSearch={handleSearch}
        className="mb-6"
      />

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
          {services.length > 0 ? (
            services.map((service) => (
              <InteractiveCard
                key={service.id}
                title={service.name}
                description={service.description}
                image={service.image}
                onClick={() => handleCardClick(service)}
                footer={
                  <div className="flex justify-between w-full items-center">
                    <span className="text-sm text-gray-500">{service.category}</span>
                    <Button variant="outline" size="sm">Payer</Button>
                  </div>
                }
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">
                Aucun service trouvé pour "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ServicesScreen;