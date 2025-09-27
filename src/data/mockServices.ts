// Définition du type pour un service public

export interface PublicService {
  id: number;            // ID unique du service
  name: string;          // Nom du service (ex: REGIDESO)
  category: string;      // Catégorie du service (ex: Eau, Impôts, etc.)
  description: string;   // Brève description du service
  image: string;         // URL ou chemin de l’image à afficher
  slug: string;          // Slug pour le routing dynamique (ex: "regideso")
  customForm: boolean;   // true si le service a un formulaire personnalisé
}

// Liste simulée des services publics disponibles
export const mockServices: PublicService[] = [
  {
    id: 1,
    name: 'EAU  ',
    category: 'Eau',
    description: 'Paiement des factures d’eau .',
    image: '/PhotosServices/CHROMA.jpg',        // Image à placer dans /public/images
    slug: 'regideso',
    customForm: true,                          // Utilise RegidesoForm.tsx
  },

  {
    id: 2,
    name: 'CASH POWER (Electricité)',
    category: 'Électricité',
    description: 'Achat de crédit d’électricité prépayée (Cash Power).',
    image: '/PhotosServices/cashpower.jpg',
    slug: 'cashpower',
    customForm: true,                  // Utilise CashPowerForm.tsx
  },


  {
    id: 3,
    name: 'Vignette Auto',
    category: 'Taxes',
    description: 'Paiement de la Vignette annuelle .',
    image: '/PhotosServices/CHROMA.jpg',
    slug: 'Vignette',
    customForm: true,                  // Utilise ObrForm.tsx
  },
  {
    id: 4,
    name: 'CNSS',
    category: 'Sécurité Sociale',
    description: 'Déclaration et paiement des cotisations sociales.',
    image: '/PhotosServices/regideso.jpg',
    slug: 'cnss',
    customForm: true,                  // Utilise CnssForm.tsx
  },
  {
    id: 5,
    name: '',
    category: '',
    description: '',
    image: '',
    slug: '',
    customForm: false,                 // Utilise formulaire générique
  },
  
  {
    id: 6,
    name: '',
    category: '',
    description: '',
    image: '',
    slug: '',
    customForm: false,
  },
  {
    id: 7,
    name: 'TRANSPORT',
    category: 'Transport',
    description: 'Paiement des droits de transport et enregistrement.',
    image: '/images/amotrans.png',
    slug: 'amotrans',
    customForm: false,
  },
  {
    id: 8,
    name: 'IMPOTS',
    category: 'Impôts',
    description: 'Paiement des impôts divers.',
    image: '/images/impots.png',
    slug: 'impots',
    customForm: false,
  }
];
