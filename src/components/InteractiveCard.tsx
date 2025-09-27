
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface InteractiveCardProps {
  title: string;
  description: string;
  image?: string;
  onClick?: () => void;
  footer?: React.ReactNode;
  className?: string;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({
  title,
  description,
  image,
  onClick,
  footer,
  className,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  return (
    <Card 
      className={cn(
        "transition-transform duration-200 cursor-pointer hover:scale-105",
        isPressed && "scale-95",
        className
      )}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {image && (
        <div className="w-full h-40 overflow-hidden rounded-t-lg">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Content can be added here when needed */}
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};

export default InteractiveCard;
