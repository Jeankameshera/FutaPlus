
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Bell, BookOpen, FileText, MessageSquare } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// Types pour les notifications
type NotificationType = 'GRADE_UPDATE' | 'ANNOUNCEMENT' | 'MESSAGE' | 'HOMEWORK';

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  description: string;
  date: string;
  read: boolean;
}

// Données fictives des notifications
const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'GRADE_UPDATE',
    title: 'Nouvelle note disponible',
    description: 'Votre note pour le cours de Mathématiques est maintenant disponible.',
    date: '2023-05-03T14:30:00',
    read: false,
  },
  {
    id: 2,
    type: 'ANNOUNCEMENT',
    title: 'Annonce importante',
    description: 'Les examens finaux commenceront le 15 juin. Consultez votre emploi du temps.',
    date: '2023-05-02T10:15:00',
    read: true,
  },
  {
    id: 3,
    type: 'MESSAGE',
    title: 'Nouveau message',
    description: 'Vous avez reçu un nouveau message de Prof. Dupont concernant votre projet.',
    date: '2023-05-01T16:45:00',
    read: false,
  },
  {
    id: 4,
    type: 'HOMEWORK',
    title: 'Devoir à rendre',
    description: 'N\'oubliez pas de rendre votre devoir de Physique avant vendredi.',
    date: '2023-04-30T09:00:00',
    read: true,
  },
  {
    id: 5,
    type: 'GRADE_UPDATE',
    title: 'Nouvelle note disponible',
    description: 'Votre note pour le cours d\'Histoire est maintenant disponible.',
    date: '2023-04-29T11:20:00',
    read: false,
  },
];

const NotificationsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeFilter, setActiveFilter] = useState<NotificationType | 'ALL'>('ALL');
  
  const handleFilterChange = (filter: NotificationType | 'ALL') => {
    setActiveFilter(filter);
  };
  
  const handleMarkAsRead = (id: number) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  const filteredNotifications = activeFilter === 'ALL'
    ? notifications
    : notifications.filter(notification => notification.type === activeFilter);
  
  const getNotificationIcon = (type: NotificationType) => {
    switch(type) {
      case 'GRADE_UPDATE':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'ANNOUNCEMENT':
        return <Bell className="h-5 w-5 text-red-500" />;
      case 'MESSAGE':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'HOMEWORK':
        return <BookOpen className="h-5 w-5 text-amber-500" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      
      <div className="flex overflow-x-auto pb-2 mb-4">
        <Badge 
          variant={activeFilter === 'ALL' ? "default" : "outline"}
          className="mr-2 cursor-pointer"
          onClick={() => handleFilterChange('ALL')}
        >
          Tous
        </Badge>
        <Badge 
          variant={activeFilter === 'GRADE_UPDATE' ? "default" : "outline"}
          className="mr-2 cursor-pointer"
          onClick={() => handleFilterChange('GRADE_UPDATE')}
        >
          Notes
        </Badge>
        <Badge 
          variant={activeFilter === 'ANNOUNCEMENT' ? "default" : "outline"}
          className="mr-2 cursor-pointer"
          onClick={() => handleFilterChange('ANNOUNCEMENT')}
        >
          Annonces
        </Badge>
        <Badge 
          variant={activeFilter === 'MESSAGE' ? "default" : "outline"}
          className="mr-2 cursor-pointer"
          onClick={() => handleFilterChange('MESSAGE')}
        >
          Messages
        </Badge>
        <Badge 
          variant={activeFilter === 'HOMEWORK' ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => handleFilterChange('HOMEWORK')}
        >
          Devoirs
        </Badge>
      </div>
      
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div 
                key={notification.id}
                className={`p-4 rounded-lg border ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{notification.title}</h3>
                      <span className="text-xs text-gray-500">{formatDate(notification.date)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">Aucune notification</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NotificationsScreen;
