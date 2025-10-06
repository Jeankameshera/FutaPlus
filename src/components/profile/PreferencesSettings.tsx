import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Mail, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import api from '@/api/api';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PreferencesSettings = () => {
  const { toast } = useToast();
  const [pushNotifications, setPushNotifications] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [paymentReminders, setPaymentReminders] = useState(true);
  const [language, setLanguage] = useState('fr');

  const handlePreferencesSubmit = async () => {
    try {
      const preferences = {
        push_notifications: pushNotifications,
        email_notifications: emailNotifications,
        payment_reminders: paymentReminders,
        language,
      };
      const response = await api.post('/update-preferences', { preferences });
      if (response.data.success) {
        toast({
          title: 'Préférences mises à jour',
          description: 'Vos préférences ont été enregistrées avec succès.',
        });
      } else {
        throw new Error(response.data.error || 'Failed to update preferences');
      }
    } catch (err: any) {
      toast({
        title: 'Erreur',
        description: err.response?.data?.error || 'Impossible de mettre à jour les préférences',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <h3 className="text-lg font-semibold mb-4">Préférences de notification</h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 border rounded-lg">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <p className="font-medium">Notifications push</p>
              <p className="text-sm text-gray-500">Recevez des alertes sur votre téléphone</p>
            </div>
          </div>
          <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
        </div>

        <div className="flex justify-between items-center p-3 border rounded-lg">
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <p className="font-medium">Notifications par email</p>
              <p className="text-sm text-gray-500">Recevez des mises à jour par email</p>
            </div>
          </div>
          <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
        </div>

        <div className="flex justify-between items-center p-3 border rounded-lg">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <p className="font-medium">Rappels de paiement</p>
              <p className="text-sm text-gray-500">Soyez alerté avant les échéances</p>
            </div>
          </div>
          <Switch checked={paymentReminders} onCheckedChange={setPaymentReminders} />
        </div>
      </div>

      <div className="mt-8 pt-6 border-t">
        <h3 className="text-lg font-semibold mb-4">Langue et région</h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 border rounded-lg">
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="font-medium">Langue</p>
                <p className="text-sm text-gray-500">Choisissez votre langue</p>
              </div>
            </div>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Langue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button
          onClick={handlePreferencesSubmit}
          className="w-full sm:w-auto bg-orange-400 hover:bg-gray-400 text-sm sm:text-base px-4 py-2"
        >
          Enregistrer les préférences
        </Button>
      </div>
    </>
  );
};

export default PreferencesSettings;