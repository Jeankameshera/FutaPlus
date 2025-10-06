// src/main.tsx
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import React, { useEffect, useState } from 'react';
import { useThemeStore } from './stores/themeStore';
import api from '@/api/api';

function ThemedAppWrapper() {
  const { theme } = useThemeStore();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Appliquer le thème
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Vérifier la validité du token au démarrage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      return;
    }
  
    try {
      // Décoder le token pour extraire l'ID utilisateur
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenData.sub;
  
      api.get(`/user/${userId}`)
        .then((response) => {
          if (response.data && response.data.id) {
            setIsAuthenticated(true);
          } else {
            throw new Error('Invalid user response');
          }
        })
        .catch((err) => {
          console.error('Token verification failed:', err);
          setIsAuthenticated(false);
          // ❌ Ne pas supprimer le token directement ici.
          // Laisse le composant Profile gérer la suppression si le token est expiré.
        });
    } catch (err) {
      console.error('Invalid token format:', err);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');
    }
  }, []);
  

  // Attendre que l'authentification soit vérifiée
  if (isAuthenticated === null) {
    return null; // Ou un loader
  }

  return <App initialRoute={isAuthenticated ? '/dashboard' : '/login'} />;
}

createRoot(document.getElementById('root')!).render(<ThemedAppWrapper />);