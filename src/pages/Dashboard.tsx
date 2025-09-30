import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BottomNav from '@/components/BottomNav';
import { FiDroplet } from 'react-icons/fi'; // Icône pour l'eau
import { FiZap } from 'react-icons/fi'; // Icône pour l'électricité
import { FaWifi } from "react-icons/fa"; // ou FaGlobe pour autre style
import { FaCar } from "react-icons/fa"; // Icône pour la voiture  
import { BiTv } from "react-icons/bi";

import {
  Menu as MenuIcon,
  User,
  Clock,
  Settings,
  SlidersHorizontal,
  Info,
  LogOut,
  Home,
  FileText
}from 'lucide-react';

import { useProfileStore } from '@/stores/useProfileStore';  // Import Zustand (Pour charger la photo de profile)

const Dashboard = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const profileImage = useProfileStore((state) => state.profileImage);  // Récupère image dynamique

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

  return (
    <Layout title="Dashboard">

      {/* === Header utilisateur sticky === */}
      <div className="sticky top-0 z-40 bg-gray-200 rounded-xl shadow-xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={profileImage}
            alt="Profil"
            className="w-20 h-20 rounded-full object-cover border-2 border-[#0A2647]"
          />
          <div>
            <h2 className="text-lg font-semibold">Jean Kameshera</h2>
            <p className="text-sm text-gray-600">+257 62 39 51 55</p>
          </div>
        </div>


        {/* === Menu Hamburger Stylé === */}
        <div className="relative font-inter ">
          <button
            ref={buttonRef}
            onClick={() => setShowMenu(!showMenu)}
            className=" p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
          
          {/* == la Deuxiemme carte pour le Cash power (Electricité)*/}

          <Card onClick={() => navigate('/cashpower')} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="bg-gray-100 p-6">
               <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br
                    from-yellow-400 to-orange-500 flex items-center justify-center
                     text-white text-2xl mr-4 shadow-md">
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
         <Card 
           onClick={() => navigate('/Internet')} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
          >
         <CardContent className="bg-gray-100 p-6">
            <div className="flex items-center">
                 {/* Icône ronde */}
                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center 
                  text-white text-2xl mr-4">
                  <FaWifi /> 
                </div>

                {/* Texte */}
                <div>
                  <h3 className="font-medium text-lg">Internet</h3>
                  <p className="text-sm text-gray-500">Abonnement mensuel internet</p>
                </div>
              </div>
           </CardContent>
         </Card>
          {/* == la Quatriemecarte pour la vignette auto == */}

          <Card 
            onClick={() => navigate('/Vignette')} 
             className="hover:shadow-md transition-shadow cursor-pointer"
             >
            <CardContent className="bg-gray-100 p-6">
              <div className="flex items-center">
                {/* Icône ronde */}
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center
                  text-white text-xl mr-4">
                     <FaCar/>
                 </div>                 
                {/* Texte */}
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
                <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center 
                justify-center text-white text-xl mr-4">
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
                <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center
                 text-white text-xl mr-4">
                  <FileText />
                </div>
                 {/* Texte */}        
                <div>
                  <h3 className="font-medium text-lg">Impôts</h3>
                  <p className="text-sm text-gray-500">Taxes et impôts d'État</p>
                </div>
              </div>
            </CardContent>
          </Card> 

          { /* == la Septieme  carte pour les transports publics  == */ }

          <Card onClick={() => navigate('/transport')} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center 
                text-white text-xl mr-4">
                 
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


