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
    description: 'Paiement des factures d’eau .', // ok
    image: '/PhotosServices/Eau.jpg',        // Image à placer dans /public/images
    slug: 'regideso',
    customForm: true,                          // Utilise RegidesoForm.tsx
  },

  {
    id: 2,
    name: 'CASH POWER (Electricité)',  //ok
    category: 'Électricité',
    description: 'Achat de crédit d’électricité prépayée (Cash Power).',
    image: '/PhotosServices/Elec.jpg',
    slug: 'cashpower',
    customForm: true,                  // Utilise CashPowerForm.tsx
  },

{
    id: 3,
    name: 'Internet',
    category: 'Connexion internet',
    description: 'Paiement de vos connexion internet ', // ok
    image: '/PhotosServices/Wifi.jpg',
    slug: '',
    customForm: false,                 // Utilise formulaire générique
  },

 {
    id: 4,
    name: 'Tv',
    category: 'Divertissement',
    description: 'paiement de l abonnement canal', // ok
    image: '/PhotosServices/Tv2.jpg',
    slug: 'Tv',
    customForm: true,                  // Utilise TvForm.tsx
  },

 
  
  {
    id: 5,
     name: 'IMPOTS',
    category: 'Impôts',
    description: 'Paiement des impôts divers.',
    image: '/PhotosServices/jambo.jpg',
    slug: 'impots',
    customForm: false,
  },

 {
    id: 6,
    name: 'Vignette Auto',
    category: 'Taxes',
    description: 'Paiement de la Vignette annuelle .',
    image: '/PhotosServices/car3.jpg',
    slug: 'Vignette',
    customForm: true,                  // Utilise ObrForm.tsx
  },

  {
    id: 7,
    name: 'TRANSPORT',
    category: 'Transport',
    description: 'Paiement des droits de transport et enregistrement.',
    image: '/PhotosServices/tCHROMA.jpg',
    slug: 'amotrans',
    customForm: false,
  },
];
