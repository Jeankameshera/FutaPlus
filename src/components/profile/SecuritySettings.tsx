
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SecuritySettingsProps {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  setCurrentPassword: (value: string) => void;
  setNewPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
}

const SecuritySettings = ({
  currentPassword,
  newPassword,
  confirmPassword,
  setCurrentPassword,
  setNewPassword,
  setConfirmPassword
}: SecuritySettingsProps) => {
  const { toast } = useToast();
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Erreur',
        description: 'Les mots de passe ne correspondent pas.',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Mot de passe mis à jour',
      description: 'Votre mot de passe a été modifié avec succès.',
    });
    
    // Reset password fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <>
      <h3 className="text-lg font-semibold mb-4">Changer le mot de passe</h3>
      
      <form onSubmit={handlePasswordSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Mot de passe actuel</Label>
            <Input 
              id="currentPassword" 
              type="password" 
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nouveau mot de passe</Label>
            <Input 
              id="newPassword" 
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500">
              Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input 
              id="confirmPassword" 
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="mt-6 w-full">
              <Button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-400 hover:bg-blue-700 text-sm sm:text-base px-4 py-2"
                      >
                    <Shield className="h-4 w-4" />
                     Mettre à jour le mot de passe
              </Button>
        </div>

      </form>
      
      <div className="mt-8 pt-6 border-t">
        <h3 className="text-lg font-semibold mb-4">Sécurité du compte</h3>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-4 border rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <p className="font-medium">Authentification à deux facteurs</p>
                  <p className="text-sm text-gray-500">Protégez votre compte avec une sécurité supplémentaire</p>
                </div>
            </div>
            <Button variant="outline" className="self-start sm:self-auto w-full sm:w-auto">
              Configurer
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-4 border rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <p className="font-medium">Appareils connectés</p>
                  <p className="text-sm text-gray-500">Gérez les appareils connectés à votre compte</p>
                </div>
            </div>
            <Button variant="outline" className="self-start sm:self-auto w-full sm:w-auto">
                  Voir
            </Button>
          </div>           
        </div>
      </div>
    </>
  );
};

export default SecuritySettings;
