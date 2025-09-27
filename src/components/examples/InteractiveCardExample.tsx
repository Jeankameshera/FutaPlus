
import React from 'react';
import InteractiveCard from '../InteractiveCard';
import { Button } from '@/components/ui/button';

const InteractiveCardExample: React.FC = () => {
  const handleCardClick = (cardId: number) => {
    console.log(`Card ${cardId} clicked!`);
  };

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <InteractiveCard
        title="Université de Paris"
        description="Une université prestigieuse située au cœur de Paris"
        image="/placeholder.svg"
        onClick={() => handleCardClick(1)}
        footer={
          <div className="flex justify-end w-full">
            <Button variant="outline" size="sm">Voir détails</Button>
          </div>
        }
      />
      
      <InteractiveCard
        title="École Polytechnique"
        description="Grande école d'ingénieurs française"
        image="/placeholder.svg"
        onClick={() => handleCardClick(2)}
        footer={
          <div className="flex justify-end w-full">
            <Button variant="outline" size="sm">Voir détails</Button>
          </div>
        }
      />
      
      <InteractiveCard
        title="Sorbonne Université"
        description="Une université multidisciplinaire de recherche intensive"
        image="/placeholder.svg"
        onClick={() => handleCardClick(3)}
        footer={
          <div className="flex justify-end w-full">
            <Button variant="outline" size="sm">Voir détails</Button>
          </div>
        }
      />
    </div>
  );
};

export default InteractiveCardExample;
