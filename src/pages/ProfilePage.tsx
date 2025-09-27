
import React, { useState } from 'react';
import AppSidebar from '@/components/AppSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import FormInput from '@/components/ui/form-input';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, Home, Book, Calendar, FileText, Lock } from 'lucide-react';

const ProfilePage = () => {
  const { toast } = useToast();
  const [firstName, setFirstName] = useState('Jean');
  const [lastName, setLastName] = useState('Étudiant');
  const [email, setEmail] = useState('jean.etudiant@example.com');
  const [phone, setPhone] = useState('06 12 34 56 78');
  const [address, setAddress] = useState('123 rue de l\'Université, 75001 Paris');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePersonalInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Profil mis à jour',
      description: 'Vos informations personnelles ont été mises à jour avec succès.',
    });
  };

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
    
    // Reset password fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    
    toast({
      title: 'Mot de passe mis à jour',
      description: 'Votre mot de passe a été modifié avec succès.',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AppSidebar />
      
      <main className="flex-1 p-6">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-2xl font-bold text-blue-800 mb-6">Mon profil</h1>
          
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <Card className="md:w-1/3">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Avatar className="w-32 h-32 bg-blue-600 text-white text-4xl">
                  <span>JE</span>
                </Avatar>
                
                <h2 className="mt-4 text-xl font-bold">Jean Étudiant</h2>
                <p className="text-gray-500">ID: 20230042</p>
                
                <div className="mt-4 w-full">
                  <div className="py-3 border-b border-gray-100">
                    <p className="text-sm text-gray-500">Programme</p>
                    <p className="font-medium">Licence Informatique</p>
                  </div>
                  <div className="py-3 border-b border-gray-100">
                    <p className="text-sm text-gray-500">Année</p>
                    <p className="font-medium">2ème année</p>
                  </div>
                  <div className="py-3 border-b border-gray-100">
                    <p className="text-sm text-gray-500">Statut</p>
                    <p className="font-medium">Actif</p>
                  </div>
                  <div className="py-3">
                    <p className="text-sm text-gray-500">Inscription</p>
                    <p className="font-medium">Septembre 2022</p>
                  </div>
                </div>
                
                <Button variant="outline" className="mt-6 w-full">Télécharger certificat de scolarité</Button>
              </CardContent>
            </Card>
            
            <div className="md:w-2/3">
              <Tabs defaultValue="personal">
                <TabsList className="mb-6">
                  <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
                  <TabsTrigger value="academic">Parcours académique</TabsTrigger>
                  <TabsTrigger value="security">Sécurité</TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal">
                  <Card>
                    <CardContent className="p-6">
                      <form onSubmit={handlePersonalInfoSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormInput
                            id="first-name"
                            label="Prénom"
                            value={firstName}
                            onChange={setFirstName}
                            validation={{
                              required: { value: true, message: 'Le prénom est requis' }
                            }}
                          />
                          
                          <FormInput
                            id="last-name"
                            label="Nom"
                            value={lastName}
                            onChange={setLastName}
                            validation={{
                              required: { value: true, message: 'Le nom est requis' }
                            }}
                          />
                          
                          <FormInput
                            id="email"
                            label="Email"
                            type="email"
                            value={email}
                            onChange={setEmail}
                            validation={{
                              required: { value: true, message: 'L\'email est requis' },
                              pattern: {
                                test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                                message: 'Format d\'email invalide'
                              }
                            }}
                          />
                          
                          <FormInput
                            id="phone"
                            label="Téléphone"
                            value={phone}
                            onChange={setPhone}
                          />
                          
                          <div className="col-span-1 md:col-span-2">
                            <FormInput
                              id="address"
                              label="Adresse"
                              value={address}
                              onChange={setAddress}
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-6">
                          <Button type="submit" className="bg-blue-600 hover:bg-gray-700">
                            Enregistrer les modifications
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="academic">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Parcours académique</h3>
                      
                      <div className="space-y-6">
                        <div className="border-l-2 border-gray-500 pl-4 py-2">
                          <div className="flex items-center mb-2">
                            <Calendar size={18} className="text-gray-600 mr-2" />
                            <span className="text-sm text-gray-500">2022 - Présent</span>
                          </div>
                          <h4 className="text-lg font-medium">Licence Informatique</h4>
                          <p className="text-gray-600">Université Paris Diderot</p>
                          <div className="flex items-center mt-2">
                            <Book size={16} className="text-gray-400 mr-2" />
                            <span className="text-sm text-gray-500">Spécialité: Développement logiciel</span>
                          </div>
                        </div>
                        
                        <div className="border-l-2 border-gray-300 pl-4 py-2">
                          <div className="flex items-center mb-2">
                            <Calendar size={18} className="text-gray-400 mr-2" />
                            <span className="text-sm text-gray-500">2020 - 2022</span>
                          </div>
                          <h4 className="text-lg font-medium">Baccalauréat Scientifique</h4>
                          <p className="text-gray-600">Lycée Henri IV, Paris</p>
                          <div className="flex items-center mt-2">
                            <FileText size={16} className="text-gray-400 mr-2" />
                            <span className="text-sm text-gray-500">Mention: Très bien</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4">Compétences</h3>
                        
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Java</span>
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Python</span>
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">JavaScript</span>
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">HTML/CSS</span>
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">SQL</span>
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">React</span>
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Git</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="security">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Changer le mot de passe</h3>
                      
                      <form onSubmit={handlePasswordSubmit}>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="current-password">Mot de passe actuel</Label>
                            <Input 
                              id="current-password" 
                              type="password" 
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="new-password">Nouveau mot de passe</Label>
                            <Input 
                              id="new-password" 
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
                            <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                            <Input 
                              id="confirm-password" 
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-6">
                          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                            Mettre à jour le mot de passe
                          </Button>
                        </div>
                      </form>
                      
                      <div className="mt-8 pt-6 border-t">
                        <h3 className="text-lg font-semibold mb-4">Sessions actives</h3>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Lock size={20} className="text-blue-600" />
                              </div>
                              <div className="ml-3">
                                <p className="font-medium">Session actuelle</p>
                                <p className="text-sm text-gray-500">Navigateur Chrome sur Windows • Paris, France</p>
                              </div>
                            </div>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Actif</span>
                          </div>
                          
                          <Button variant="outline" className="w-full border-red-500 text-red-500 hover:bg-red-50">
                            Se déconnecter de toutes les sessions
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
