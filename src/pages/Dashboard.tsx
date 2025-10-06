import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BottomNav from '@/components/BottomNav';
import { FiDroplet, FiZap } from 'react-icons/fi';
import { FaWifi, FaCar } from 'react-icons/fa';
import { BiTv } from 'react-icons/bi';
import { Menu as MenuIcon, User, Clock, Settings, SlidersHorizontal, Info, FileText } from 'lucide-react';
import api from '@/api/api';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150');
  const [loading, setLoading] = useState(true);
  const BASE_URL = 'http://localhost:8000';

  // Charger les données utilisateur au montage
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
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const userId = tokenData.sub;
        console.log('Fetching user with ID:', userId);
        const response = await api.get(`/user/${userId}`);
        console.log('User data response:', response.data);
        if (response.data.id) {
          setFirstName(response.data.first_name || '');
          setLastName(response.data.last_name || '');
          setPhone(response.data.phone || '');
          setProfileImage(
            response.data.profile_image
              ? `${BASE_URL}${response.data.profile_image}`
              : 'https://via.placeholder.com/150'
          );
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
        localStorage.removeItem('userRole');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate, toast]);

  // Fermer le menu en cliquant hors menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Chargement...</div>;
  }

  return (
    <Layout title="Dashboard">
      {/* === Header utilisateur sticky === */}
      <div className="sticky top-0 z-40 bg-gray-200 rounded-xl shadow-xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={profileImage}
            alt="Profil"
            className="w-20 h-20 rounded-full object-cover border-2 border-[#0A2647]"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/150';
            }}
          />
          <div>
            <h2 className="text-lg font-semibold">{firstName} {lastName}</h2>
            <p className="text-sm text-gray-600">{phone || 'Non défini'}</p>
          </div>
        </div>

        {/* === Menu Hamburger Stylé === */}
        <div className="relative font-inter">
          <button
            ref={buttonRef}
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <MenuIcon className="w-7 h-7 text-gray-700" />
          </button>

          {showMenu && (
            <div
              ref={menuRef}
              className="absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
              onMouseLeave={() => setShowMenu(false)}
            >
              <button
                onClick={() => {
                  navigate('/Profile');
                  setShowMenu(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-orange-50 transition"
              >
                <User className="w-5 h-5 text-orange-600" />
                Mon Compte
              </button>

              <button
                onClick={() => {
                  navigate('/history');
                  setShowMenu(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-orange-50 transition"
              >
                <Clock className="w-5 h-5 text-orange-600" />
                Historique
              </button>

              <button
                onClick={() => {
                  navigate('/settings');
                  setShowMenu(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-orange-50 transition"
              >
                <SlidersHorizontal className="w-5 h-5 text-orange-600" />
                Configuration
              </button>

              <button
                onClick={() => {
                  navigate('/settings');
                  setShowMenu(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-orange-50 transition"
              >
                <Settings className="w-5 h-5 text-orange-600" />
                Paramètres
              </button>

              <button
                onClick={() => {
                  navigate('/about');
                  setShowMenu(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-orange-50 transition"
              >
                <Info className="w-5 h-5 text-orange-600" />
                À propos
              </button>
            </div>
          )}
        </div>
      </div>

      {/* === Contenu principal === */}
      <div className="pb-24 pt-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Services de paiement</h1>
          <p className="text-gray-400 italic">Sélectionnez un service pour effectuer un paiement</p>
        </div>

        {/* === Cartes de services avec navigation directe === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* == la Premiere carte eau == */}
          <Card onClick={() => navigate('/regideso')} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="bg-gray-100 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl mr-4 shadow-md">
                  <FiDroplet />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">Eau</h3>
                  <p className="text-sm text-gray-500">Paiement des factures d'eau et d'électricité</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* == la Deuxiemme carte pour le Cash power (Electricité) == */}
          <Card onClick={() => navigate('/cashpower')} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="bg-gray-100 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-2xl mr-4 shadow-md">
                  <FiZap />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">Cash Power Électricité</h3>
                  <p className="text-sm text-gray-500">Achat de crédit d’électricité prépayée (Cash Power)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* == la Troisieme carte pour la vignette == */}
          <Card onClick={() => navigate('/Internet')} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="bg-gray-100 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white text-2xl mr-4">
                  <FaWifi />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Internet</h3>
                  <p className="text-sm text-gray-500">Abonnement mensuel internet</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* == la Quatrieme carte pour la vignette auto == */}
          <Card onClick={() => navigate('/Vignette')} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="bg-gray-100 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white text-xl mr-4">
                  <FaCar />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Vignette Auto</h3>
                  <p className="text-sm text-gray-500">Paiement de la vignette annuelle</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cinquieme carte pour la TV */}
          <Card onClick={() => navigate('/Tv')} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="bg-gray-100 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center text-white text-xl mr-4">
                  <BiTv />
                </div>
                <div>
                  <h3 className="font-medium text-lg">TV</h3>
                  <p className="text-sm text-gray-500">Paiement de l'abonnement TV</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* == la Sixieme carte pour les taxes et impôts d'État == */}
          <Card onClick={() => navigate('/impot')} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="bg-gray-100 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white text-xl mr-4">
                  <FileText />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Impôts</h3>
                  <p className="text-sm text-gray-500">Taxes et impôts d'État</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* == la Septieme carte pour les transports publics == */}
          <Card onClick={() => navigate('/transport')} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xl mr-4">
                  <FaCar />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Transport</h3>
                  <p className="text-sm text-gray-500">Paiement des transports publics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNav />
    </Layout>
  );
};

export default Dashboard;