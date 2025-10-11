// src/pages/Dashboard.tsx
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

// Interface pour les services
interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  image: string;
  slug: string;
  type: 'prepaid' | 'postpaid';
  plans: { name: string; price: number }[] | null;
}

// Mapping des icônes, couleurs et routes par slug
const serviceConfig = {
  'regideso': { icon: <FiDroplet />, gradient: 'from-blue-400 to-blue-600', route: '/regideso' },
  'cashpower': { icon: <FiZap />, gradient: 'from-yellow-400 to-orange-500', route: '/cashpower' },
  'internet': { icon: <FaWifi />, gradient: 'from-purple-400 to-purple-600', route: '/internet' },
  'tv': { icon: <BiTv />, gradient: 'from-pink-400 to-pink-600', route: '/tv' },
  'impots': { icon: <FileText />, gradient: 'from-red-400 to-red-600', route: '/impot' },
  'vignette': { icon: <FaCar />, gradient: 'from-green-400 to-green-600', route: '/vignette' },
  'transport': { icon: <FaCar />, gradient: 'from-indigo-400 to-indigo-600', route: '/transport' },
};

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
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const BASE_URL = 'http://localhost:8000';

  // Charger les données utilisateur et services au montage
  useEffect(() => {
    const fetchData = async () => {
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
        const [userResponse, servicesResponse] = await Promise.all([
          api.get(`/user/${userId}`),
          api.get('/services'),
        ]);

        // Données utilisateur
        if (userResponse.data.id) {
          setFirstName(userResponse.data.first_name || '');
          setLastName(userResponse.data.last_name || '');
          setPhone(userResponse.data.phone || '');
          setProfileImage(
            userResponse.data.profile_image
              ? `${BASE_URL}${userResponse.data.profile_image}`
              : 'https://via.placeholder.com/150'
          );
          // Récupérer le rôle de l'utilisateur
          setUserRole(userResponse.data.role || 'user');
        } else {
          throw new Error(userResponse.data.error || 'Failed to load user data');
        }

        // Données services
        setServices(servicesResponse.data);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        let errorMessage = err.response?.data?.error || 'Impossible de charger les données';
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

    fetchData();
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

  // Vérifier si l'utilisateur est administrateur
  const isAdmin = userRole === 'admin';

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
            {isAdmin && (
              <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full mt-1">
                Administrateur
              </span>
            )}
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

              {/* Afficher le bouton Dashboard seulement pour les administrateurs */}
              {isAdmin && (
                <button
                  onClick={() => {
                    navigate('/admin/dashboard');
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-orange-50 transition"
                >
                  <User className="w-5 h-5 text-orange-600" />
                  Dashboard
                </button>
              )}

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

        {/* === Cartes de services dynamiques === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.length > 0 ? (
            services.map((service) => {
              const config = serviceConfig[service.slug] || {
                icon: <FileText />,
                gradient: 'from-gray-400 to-gray-600',
                route: `/service-detail/${service.id}`,
              };
              return (
                <Card
                  key={service.id}
                  onClick={() => navigate(config.route)}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardContent className="bg-gray-100 p-6">
                    <div className="flex items-center">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white text-2xl mr-4 shadow-md`}
                      >
                        {config.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">{service.name}</h3>
                        <p className="text-sm text-gray-500">{service.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">Aucun service disponible pour le moment.</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </Layout>
  );
};

export default Dashboard;