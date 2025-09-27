
export interface LibraryComponent {
  type: string;
  name: string;
  category: 'UI' | 'SCREEN' | 'PAGE';
  platform: 'MOBILE' | 'WEB' | 'BOTH';  // Keep BOTH as an option
  description: string;
  defaultProps?: Record<string, any>;
  thumbnail?: string;
}

export const componentLibrary: LibraryComponent[] = [
  {
    type: 'INTERACTIVE_CARD',
    name: 'Interactive Card',
    category: 'UI',
    platform: 'BOTH',
    description: 'Cliquable avec animation (mobile: scale avec Reanimated; web: survol avec CSS)',
    defaultProps: {
      title: 'Card Title',
      description: 'Card description text',
      image: '/placeholder.svg',
    }
  },
  {
    type: 'SEARCH_BAR',
    name: 'Search Bar',
    category: 'UI',
    platform: 'BOTH',
    description: 'Barre de recherche avec debounce pour filtrer',
    defaultProps: {
      placeholder: 'Rechercher...',
      debounceTime: 300
    }
  },
  {
    type: 'FORM_INPUT',
    name: 'Form Input',
    category: 'UI',
    platform: 'BOTH',
    description: 'Champ de formulaire avec validation',
    defaultProps: {
      label: 'Input Label',
      placeholder: 'Enter text...',
      validation: 'none'
    }
  },
  {
    type: 'UNIVERSITIES_SCREEN',
    name: 'Universities Screen',
    category: 'SCREEN',
    platform: 'MOBILE',
    description: 'Liste des universités avec recherche et filtres',
  },
  {
    type: 'NOTIFICATIONS_SCREEN',
    name: 'Notifications Screen',
    category: 'SCREEN',
    platform: 'MOBILE',
    description: 'Liste des notifications avec filtres par type',
  },
  {
    type: 'MESSAGES_SCREEN',
    name: 'Messages Screen',
    category: 'SCREEN',
    platform: 'MOBILE',
    description: 'Liste des messages avec tri',
  },
  {
    type: 'ABOUT_SCREEN',
    name: 'About Screen',
    category: 'SCREEN',
    platform: 'MOBILE',
    description: 'Page statique "À propos" avec texte et bouton "Retour"',
  },
  {
    type: 'PROFILE_PAGE',
    name: 'Profile Page',
    category: 'PAGE',
    platform: 'WEB',
    description: 'Page de profil avec formulaire pour modifier les préférences',
  }
];
