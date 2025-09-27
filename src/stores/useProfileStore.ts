// src/store/profile.ts
import { create } from 'zustand';

interface ProfileState {
  profileImage: string;                 // Stocke l'URL ou la donnée base64 de l'image de profil
  setProfileImage: (image: string) => void;  // Fonction pour mettre à jour l'image
}

const STORAGE_KEY = 'profileImage';    // Clé pour localStorage

export const useProfileStore = create<ProfileState>((set) => {
  // Récupérer l'image enregistrée dans localStorage, ou utiliser une image par défaut
  const savedImage = localStorage.getItem(STORAGE_KEY) || '/profile.JPG';

  return {
    profileImage: savedImage,  // Initialiser l'état avec l'image sauvegardée
    setProfileImage: (image: string) => {
      localStorage.setItem(STORAGE_KEY, image);  // Sauvegarder dans localStorage
      set({ profileImage: image });              // Mettre à jour l'état Zustand
    },
  };
});
