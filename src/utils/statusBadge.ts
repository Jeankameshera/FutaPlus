
export const getStatusBadge = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'réussi':
    case 'payé':
      return 'bg-green-100 text-green-800';
    case 'en attente':
      return 'bg-yellow-100 text-yellow-800';
    case 'échoué':
    case 'en retard':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
