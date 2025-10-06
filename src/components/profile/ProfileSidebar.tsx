import React from 'react';
import { Mail, Phone, MapPin, User } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import api from '@/api/api';

// Props interface
interface ProfileSidebarProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  profileImage: string;
  createdAt: string;
  setProfileImage: (value: string) => void;
}

const ProfileSidebar = ({
  firstName,
  lastName,
  email,
  phone,
  address,
  profileImage,
  createdAt,
  setProfileImage,
}: ProfileSidebarProps) => {
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

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
  };

  return (
    <div className="flex flex-col items-center text-center">
      <Avatar className="w-32 h-32 bg-orange-400 text-white text-4xl">
        <img
          src={profileImage}
          alt="Profil"
          className="w-32 h-32 object-cover rounded-full"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/150';
          }}
        />
      </Avatar>

      <h2 className="mt-4 text-xl font-bold">{firstName} {lastName}</h2>
      <p className="text-gray-500">Membre depuis {formatDate(createdAt)}</p>

      <div className="mt-4 w-full">
        <div className="flex items-center py-2">
          <Mail className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-600">{email}</span>
        </div>
        <div className="flex items-center py-2">
          <Phone className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-600">{phone || 'Non défini'}</span>
        </div>
        <div className="flex items-center py-2">
          <MapPin className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-600">{address || 'Non défini'}</span>
        </div>
      </div>

      <Button variant="outline" className="mt-6 w-full" onClick={handleButtonClick}>
        <User className="mr-2 h-4 w-4" />
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
  );
};

export default ProfileSidebar;