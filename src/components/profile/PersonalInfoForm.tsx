import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import api from '@/api/api';
import { User } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar'; 

// Props interface
interface PersonalInfoFormProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  profileImage: string;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setEmail: (value: string) => void;
  setPhone: (value: string) => void;
  setAddress: (value: string) => void;
  setProfileImage: (value: string) => void;
}

// PersonalInfoForm component
const PersonalInfoForm = ({
  firstName,
  lastName,
  email,
  phone,
  address,
  profileImage,
  setFirstName,
  setLastName,
  setEmail,
  setPhone,
  setAddress,
  setProfileImage,
}: PersonalInfoFormProps) => {
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const BASE_URL = 'http://localhost:8000'; 

  // Open file selector
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Handle image upload via API
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verify file type and size
    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner une image JPG ou PNG.',
        variant: 'destructive',
      });
      return;
    }
    if (file.size > maxSize) {
      toast({
        title: 'Erreur',
        description: 'L’image ne doit pas dépasser 5 Mo.',
        variant: 'destructive',
      });
      return;
    }

    const formData = new FormData();
    formData.append('profile_image', file);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await api.post('/update-profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const fullImageUrl = `${BASE_URL}${response.data.profile_image}`;
        setProfileImage(fullImageUrl);
        toast({
          title: 'Succès',
          description: 'Photo de profil mise à jour.',
        });

        // Re-fetch user data to synchronize
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const userId = tokenData.sub;
        const userResponse = await api.get(`/user/${userId}`);
        if (userResponse.data.id) {
          setProfileImage(`${BASE_URL}${userResponse.data.profile_image || '/Uploads/profiles/default.jpg'}`);
        }
      } else {
        throw new Error(response.data.error || 'Failed to upload image');
      }
    } catch (err: any) {
      toast({
        title: 'Erreur',
        description: err.message || 'Impossible de mettre à jour la photo de profil.',
        variant: 'destructive',
      });
    }
  };

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/update-personal', {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        address,
      });
      if (response.data.success) {
        toast({
          title: 'Profil mis à jour',
          description: 'Vos informations personnelles ont été mises à jour avec succès.',
        });
      } else {
        throw new Error(response.data.error || 'Failed to update profile');
      }
    } catch (err: any) {
      toast({
        title: 'Erreur',
        description: err.response?.data?.error || 'Impossible de mettre à jour le profil',
        variant: 'destructive',
      });
    }
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
            disabled 
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

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="profileImage">Photo de profil</Label>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 bg-orange-400 text-white text-2xl">
              <img
                src={profileImage}
                alt="Profil"
                className="w-16 h-16 object-cover rounded-full"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/150';
                }}
              />
            </Avatar>
            <Button
              type="button"
              variant="outline"
              className="flex items-center justify-center gap-2"
              onClick={handleButtonClick}
            >
              <User className="h-4 w-4" />
              Changer la photo
            </Button>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 w-full">
        <Button
          type="submit"
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-400 hover:bg-gray-400 text-sm sm:text-base px-4 py-2"
        >
          Enregistrer les modifications
        </Button>
      </div>
    </form>
  );
};

export default PersonalInfoForm;