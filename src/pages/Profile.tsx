import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import PersonalInfoForm from '@/components/profile/PersonalInfoForm';
import SecuritySettings from '@/components/profile/SecuritySettings';
import PreferencesSettings from '@/components/profile/PreferencesSettings';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  // États pour les infos personnelles
  const [firstName, setFirstName] = useState('Jean');
  const [lastName, setLastName] = useState('Kameshera');
  const [email, setEmail] = useState('kamesherajean@gmail.com');
  const [phone, setPhone] = useState('+257 62 39 51 55');
  const [address, setAddress] = useState('Bujumbura, Carama / Gahahe');

  // États pour la sécurité
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Fonction pour revenir au dashboard
  const goBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Layout title="Profil">
      
      {/* Bouton retour */}
      <button
          onClick={() => navigate("/dashboard")}
           className="absolute top-4 left-4 flex items-center text-orange-500 hover:text-orange-900 transition"
           >
             <ArrowLeft className="w-5 h-5 mr-1" />
            <span className="font-semibold text-md  ">Retour</span>
        </button>

      <div className="px-4 py-6 sm:px-6 md:px-9 lg:px-12 ">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-800">Mon profil</h1>
          <p className="text-gray-400">Gérez vos informations personnelles et vos préférences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar avec photo de profil et infos */}
          <Card className="lg:col-span-1">
            <CardContent className="p-6">
              <ProfileSidebar 
                firstName={firstName}
                lastName={lastName}
                email={email}
                phone={phone}
                address={address}
              />
            </CardContent>
          </Card>

          {/* Onglets des infos, sécurité et préférences */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="personal">
              <TabsList className="flex flex-row flex-nowrap gap-4 mb-6 overflow-x-auto">
                <TabsTrigger value="personal">Informations</TabsTrigger>
                <TabsTrigger value="security">Sécurité</TabsTrigger>
                <TabsTrigger value="preferences">Préférences</TabsTrigger>
             </TabsList>

              <TabsContent value="personal">
                <Card>
                  <CardContent className="p-6">
                    <PersonalInfoForm
                      firstName={firstName}
                      lastName={lastName}
                      email={email}
                      phone={phone}
                      address={address}
                      setFirstName={setFirstName}
                      setLastName={setLastName}
                      setEmail={setEmail}
                      setPhone={setPhone}
                      setAddress={setAddress}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card>
                  <CardContent className="p-6">
                    <SecuritySettings
                      currentPassword={currentPassword}
                      newPassword={newPassword}
                      confirmPassword={confirmPassword}
                      setCurrentPassword={setCurrentPassword}
                      setNewPassword={setNewPassword}
                      setConfirmPassword={setConfirmPassword}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences">
                <Card>
                  <CardContent className="p-6">
                    <PreferencesSettings />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
