import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import React, { useEffect } from 'react';
import { useThemeStore } from './stores/themeStore';

// Vérifier si l'utilisateur est connecté
const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

// Composant qui applique le thème avant de charger l'app
function ThemedAppWrapper() {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return <App initialRoute={isLoggedIn ? '/login' : '/dashboard'} />;
}

createRoot(document.getElementById('root')!).render(<ThemedAppWrapper />);
