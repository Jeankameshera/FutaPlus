import React, { useState, useCallback } from 'react';
import InteractiveCard from '@/components/InteractiveCard'; // Carte interactive pour chaque service
import SearchBar from '@/components/ui/search-bar';         // Barre de recherche réutilisable
import { Button } from '@/components/ui/button';             // Bouton stylisé
import { ScrollArea } from '@/components/ui/scroll-area';    // Zone scrollable pour la liste
import { ArrowLeft } from 'lucide-react';                    // Icône de retour
import { useNavigate } from 'react-router-dom';              // Navigation entre pages

// Type représentant un service public
interface PublicService {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
}

// Import des données mock depuis le fichier dédié (adapté à ta structure)
import { mockServices } from '@/data/mockServices';

const ServicesScreen: React.FC = () => {
  const navigate = useNavigate(); //   Hook de navigation
  const [services, setServices] = useState<PublicService[]>(mockServices); // Liste des services
  const [searchQuery, setSearchQuery] = useState<string>('');              // Texte recherché

  // Fonction appelée à chaque recherche dans la barre de recherche
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);

    if (!query) {
      // Si recherche vide, on affiche la liste complète
      setServices(mockServices);
      return;
    }

    // Filtrer les services selon le texte tapé (sur nom, catégorie et description)
    const filteredServices = mockServices.filter((service) =>
      service.name.toLowerCase().includes(query.toLowerCase()) ||
      service.category.toLowerCase().includes(query.toLowerCase()) ||
      service.description.toLowerCase().includes(query.toLowerCase())
    );

    setServices(filteredServices);
  }, []);

  // Gestion du clic sur une carte : naviguer vers la page du service
  const handleCardClick = (service: PublicService) => {
    console.log('Service sélectionné:', service);    
    navigate(`/service-detail/${service.id}`); // Exemple : route dynamique selon l’id du service
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">

      {/* Bouton de retour en arrière */}
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => {
          if (window.history.length > 2) {
            navigate(-1); // Revenir à la page précédente
          } else {
            navigate('/dashboard'); // Si pas d'historique, aller au dashboard
          }
        }}
      >
              
        <ArrowLeft size={16} className="mr-2" />
        Retour
      </Button>

      {/* Titre de la page */}
      <h1 className="text-2xl font-bold mb-6">Mes Services</h1>

      {/* Barre de recherche */}
      <SearchBar
        placeholder="Rechercher un service, une catégorie..."
        onSearch={handleSearch}
        className="mb-6"
      />

      {/* Liste scrollable des services */}
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
