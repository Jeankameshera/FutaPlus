
import React, { useState, useCallback } from 'react';
import InteractiveCard from '@/components/InteractiveCard';
import SearchBar from '@/components/ui/search-bar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin } from 'lucide-react';

// Types pour les universités
interface University {
  id: number;
  name: string;
  location: string;
  description: string;
  image: string;
}

// Données fictives des universités
const mockUniversities: University[] = [
  {
    id: 1,
    name: 'Université de Paris',
    location: 'Paris, France',
    description: 'Une université prestigieuse située au cœur de Paris',
    image: '/placeholder.svg',
  },
  {
    id: 2,
    name: 'École Polytechnique',
    location: 'Palaiseau, France',
    description: 'Grande école d\'ingénieurs française',
    image: '/placeholder.svg',
  },
  {
    id: 3,
    name: 'Sorbonne Université',
    location: 'Paris, France',
    description: 'Une université multidisciplinaire de recherche intensive',
    image: '/placeholder.svg',
  },
  {
    id: 4,
    name: 'Université de Lyon',
    location: 'Lyon, France',
    description: 'Pôle de recherche et d\'enseignement supérieur',
    image: '/placeholder.svg',
  },
  {
    id: 5,
    name: 'Université de Bordeaux',
    location: 'Bordeaux, France',
    description: 'Université pluridisciplinaire de recherche',
    image: '/placeholder.svg',
  },
];

const UniversitiesScreen: React.FC = () => {
  const [universities, setUniversities] = useState<University[]>(mockUniversities);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (!query) {
      setUniversities(mockUniversities);
      return;
    }
    
    const filteredUniversities = mockUniversities.filter(university => {
      return (
        university.name.toLowerCase().includes(query.toLowerCase()) ||
        university.location.toLowerCase().includes(query.toLowerCase()) ||
        university.description.toLowerCase().includes(query.toLowerCase())
      );
    });
    
    setUniversities(filteredUniversities);
  }, []);
  
  const handleCardClick = (university: University) => {
    console.log('Université sélectionnée:', university);
    // Ici, on pourrait naviguer vers la page de détails de l'université
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Liste des Universités</h1>
      
      <SearchBar 
        placeholder="Rechercher par nom, lieu..."
        onSearch={handleSearch}
        className="mb-6"
      />
      
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
          {universities.length > 0 ? (
            universities.map((university) => (
              <InteractiveCard
                key={university.id}
                title={university.name}
                description={university.description}
                image={university.image}
                onClick={() => handleCardClick(university)}
                footer={
                  <div className="flex justify-between w-full items-center">
                    <div className="flex items-center text-gray-500">
                      <MapPin size={14} className="mr-1" />
                      <span className="text-sm">{university.location}</span>
                    </div>
                    <Button variant="outline" size="sm">Détails</Button>
                  </div>
                }
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">Aucune université trouvée pour "{searchQuery}"</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default UniversitiesScreen;
