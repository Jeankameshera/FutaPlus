
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Mail, Globe } from 'lucide-react';

const PreferencesSettings = () => {
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
          <Button variant="outline">Configurer</Button>
        </div>
        
        <div className="flex justify-between items-center p-3 border rounded-lg">
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <p className="font-medium">Notifications par email</p>
              <p className="text-sm text-gray-500">Recevez des mises à jour par email</p>
            </div>
          </div>
          <Button variant="outline">Configurer</Button>
        </div>
        
        <div className="flex justify-between items-center p-3 border rounded-lg">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <p className="font-medium">Rappels de paiement</p>
              <p className="text-sm text-gray-500">Soyez alerté avant les échéances</p>
            </div>
          </div>
          <Button variant="outline">Configurer</Button>
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
                <p className="text-sm text-gray-500">Français</p>
              </div>
            </div>
            <Button variant="outline">Changer</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PreferencesSettings;
