import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import PersonalInfoForm from '@/components/profile/PersonalInfoForm';
import SecuritySettings from '@/components/profile/SecuritySettings';
import PreferencesSettings from '@/components/profile/PreferencesSettings';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/api';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // State for personnal data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [loading, setLoading] = useState(true);

  // State for security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Load user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        toast({
          title: 'Erreur',
          description: 'Aucun token d’authentification trouvé. Veuillez vous reconnecter.',
          variant: 'destructive',
        });
        navigate('/login');
        return;
      }

      try {
        const BASE_URL = 'http://localhost:8000';
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const userId = tokenData.sub;
        console.log('Fetching user with ID:', userId);
        const response = await api.get(`/user/${userId}`);
        console.log('User data response:', response.data);
        if (response.data.id) {
          setFirstName(response.data.first_name || '');
          setLastName(response.data.last_name || '');
          setEmail(response.data.email || '');
          setPhone(response.data.phone || '');
          setAddress(response.data.address || '');
          setProfileImage(
            response.data.profile_image
              ? `${BASE_URL}${response.data.profile_image}`
              : 'https://via.placeholder.com/150'
          );
          setCreatedAt(response.data.created_at || '');
        } else {
          throw new Error(response.data.error || 'Failed to load user data');
        }
      } catch (err: any) {
        console.error('Error fetching user:', err);
        let errorMessage = err.response?.data?.error || 'Impossible de charger les données utilisateur';
        if (errorMessage.includes('Expired token')) {
          errorMessage = 'Votre session a expiré. Veuillez vous reconnecter.';
        }
        toast({
          title: 'Erreur',
          description: errorMessage,
          variant: 'destructive',
        });
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate, toast]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Chargement...</div>;
  }

  return (
    <Layout title="Profil">
      {/* Bouton retour */}
      <button
        onClick={() => navigate('/dashboard')}
        className="absolute top-4 left-4 flex items-center text-orange-500 hover:text-orange-900 transition"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        <span className="font-semibold text-md">Retour</span>
      </button>

      <div className="px-4 py-6 sm:px-6 md:px-9 lg:px-12">
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
                profileImage={profileImage}
                createdAt={createdAt}
                setProfileImage={setProfileImage}
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
                      profileImage={profileImage}
                      setFirstName={setFirstName}
                      setLastName={setLastName}
                      setEmail={setEmail}
                      setPhone={setPhone}
                      setAddress={setAddress}
                      setProfileImage={setProfileImage}
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