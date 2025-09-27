import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Globe, ArrowLeft, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6 relative"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Carte centrale */}
      <div className="relative bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 max-w-2xl w-full text-center">

        {/*  Bouton de retour  */}
        <button
          onClick={() => navigate(-1)}
           className="absolute top-4 left-4 flex items-center text-orange-500 hover:text-orange-900 transition"
           >
             <ArrowLeft className="w-5 h-5 mr-1" />
            <span className="font-semibold text-md  ">Retour</span>
            <span className='font-semibold text-md'>Bonjour</span>
        </button>

        <motion.div
          className="text-3xl font-extrabold text-orange-600 mb-2 w-20 h-20 mx-auto flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 120 }}
        >
          FuTa+
        </motion.div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Version 1.0.0</p>

        <p className="text-gray-700 dark:text-gray-200 mb-6 leading-relaxed text-justify font-inter text-[10px]">
          FUTA+ est une application innovante qui simplifie et sécurise le paiement des services publics tels que la 
          <strong> REGIDESO (CashPower, Factures)</strong>, <strong> la Vignette Auto</strong>, 
          <strong> les Impôts</strong>, <strong>l'internet</strong> et bien plus encore, 
          le tout en quelques clics, où que vous soyez.
        </p>

        <div className="mb-5">
          <h2 className="text-[10px] font-semibold text-gray-800 dark:text-gray-100 mb-1">Développé par</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm">Ir HERI Kameshera Jean "Rika+"</p>
        </div>

        <div className="mb-6 space-y-2">
          <h2 className="text-[10px] font-semibold text-gray-800 dark:text-gray-100 mb-2">Contact</h2>
          <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300">
            <Mail size={18} />
            <a href="kamesherajean@gmail.com" className="text-orange-500 hover:underline">
              kamesherajean@gmail.com
            </a>
          
          </div>

          <div className="flex items-center justify-center space-x2 text-gray-600 dark:text-gray-300">
            <Phone saze={18}/>
            <a href="+257 62 39 51 55" className="text-orange-500 hover:underline">+257 62 39 51 55</a>
          </div>


          <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300">
            <Globe size={18} />
            <a
              href="https://futaplus.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:underline"
            >
              www.futaplus.app
            </a>
          </div>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-8">
          Merci d’utiliser FUTA+
        </p>
      </div>
    </motion.div>
  );
}
