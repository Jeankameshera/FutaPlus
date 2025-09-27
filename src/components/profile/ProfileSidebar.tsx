import React from 'react';
import { Mail, Phone, MapPin, User } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useProfileStore } from '@/stores/useProfileStore';

interface ProfileSidebarProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

const ProfileSidebar = ({ firstName, lastName, email, phone, address }: ProfileSidebarProps) => {
  const profileImage = useProfileStore((state) => state.profileImage);
  const setProfileImage = useProfileStore((state) => state.setProfileImage);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Ouvre le sélecteur de fichier
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Convertit l'image en base64 et met à jour le store + localStorage
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProfileImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center text-center">
      <Avatar className="w-32 h-32 bg-orange-400 text-white text-4xl">
        <img
          src={profileImage}
          alt="Profil"
          className="w-32 h-32 object-cover rounded-full"
        />
      </Avatar>

      <h2 className="mt-4 text-xl font-bold">{firstName} {lastName}</h2>
      <p className="text-gray-500">Membre depuis mars 2025</p>

      <div className="mt-4 w-full">
        <div className="flex items-center py-2">
          <Mail className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-600">{email}</span>
        </div>
        <div className="flex items-center py-2">
          <Phone className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-600">{phone}</span>
        </div>
        <div className="flex items-center py-2">
          <MapPin className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-600">{address}</span>
        </div>
      </div>

      <Button variant="outline" className="mt-6 w-full" onClick={handleButtonClick}>
        <User className="mr-2 h-4 w-4" />
        Changer la photo
      </Button>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
        className="hidden"
      />
    </div>
  );
};

export default ProfileSidebar;
