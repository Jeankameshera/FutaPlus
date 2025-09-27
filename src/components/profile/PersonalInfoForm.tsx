
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface PersonalInfoFormProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setEmail: (value: string) => void;
  setPhone: (value: string) => void;
  setAddress: (value: string) => void;
}

const PersonalInfoForm = ({
  firstName,
  lastName,
  email,
  phone,
  address,
  setFirstName,
  setLastName,
  setEmail,
  setPhone,
  setAddress
}: PersonalInfoFormProps) => {
  const { toast } = useToast();
  
  const handlePersonalInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Profil mis à jour',
      description: 'Vos informations personnelles ont été mises à jour avec succès.',
    });
  };

  return (
    <form onSubmit={handlePersonalInfoSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input 
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input 
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input 
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Adresse</Label>
          <Input 
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
      </div>
      
      <div className="mt-6 w-full">
        <Button 
          type="submit" 
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-400 hover:bg-gray-400 text-sm sm:text-base px-4 py-2">
          Enregistrer les modifications
        </Button>
      </div>
    </form>
  );
};

export default PersonalInfoForm;
