import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon, LogOut, ArrowLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch"; // optionnel
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "@/stores/themeStore"; // 
export default function SettingsPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore(); // 
  
  <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
  
  

  return (
    <motion.div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex justify-center items-start"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative w-full max-w-3xl bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 space-y-8">

        {/* Bouton retour */}
        <button
          onClick={() => navigate(-1)}
           className="absolute top-4 left-4 flex items-center text-orange-500 hover:text-orange-900 transition"
           >
             <ArrowLeft className="w-5 h-5 mr-1" />
            <span className="font-semibold text-md  ">Retour</span>
        </button>

          {/* ça c'est le grand titre du paramètre */}
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center">Paramètres</h1>

        {/* Préférences générales */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Préférences générales</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Thème sombre</span>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Langue</span>
              <select className="bg-gray-100 dark:bg-gray-700 text-sm text-gray-700 dark:text-white rounded px-3 py-1">
                <option>Français</option>
                <option>English</option>
                
              </select>
            </div>
          </div>
        </section>


        {/* Notifications */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">E-mail</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">SMS</span>
              <Switch />
            </div>
          </div>
        </section>


        {/* Sécurité */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Sécurité</h2>
          <button
            onClick={() => navigate("/profile")}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm"
          >Changer le mot de passe
          </button>
        </section>

        {/* Déconnexion */}
        <section className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 text-sm text-red-700 hover:underline"
          >
            <LogOut size={18} /> Se déconnecter
          </button>

        </section>
      </div>
    </motion.div>
  );
}
