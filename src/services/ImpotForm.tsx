// src/pages/ImpotsPage.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Pour les animations entre étapes
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav"; // Barre de navigation en bas


export default function ImpotsPage() {
  const navigate = useNavigate();

  // États pour gérer les étapes et les champs du formulaire
  const [step, setStep] = useState(1); // Étape courante
  const [impotType, setImpotType] = useState(""); // Type d’impôt sélectionné
  const [nif, setNif] = useState(""); // Numéro d’identification fiscale
  const [nom, setNom] = useState(""); // Nom du contribuable
  const [montant, setMontant] = useState(""); // Montant à payer
  const [periode, setPeriode] = useState(""); // Période fiscale
  const [modePaiement, setModePaiement] = useState(""); // Mode de paiement choisi
  const [codePin, setCodePin] = useState(""); // Code PIN de validation
  const [error, setError] = useState(""); // Message d’erreur
  const [isLoading, setIsLoading] = useState(false); // Loader en cours

  // Liste des types d’impôts disponibles
  const impots = [
    "Impôt sur le revenu",
    "Taxe sur la valeur ajoutée (TVA)",
    "Impôt foncier",
    "Impôt sur les sociétés",
    "Droits de timbre / Taxe administrative",
    "Autres taxes locales"
  ];

  // Liste des périodes fiscales
  const periodes = ["Mois", "Trimestre", "Année"];

  // Fonction pour passer à l’étape suivante avec validation
  const handleNext = () => {
    setError(""); 
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      switch (step) {
        case 1:
          // Vérifie les champs obligatoires de l’étape 1
          if (!impotType) {
            setError("Veuillez sélectionner le type d'impôt.");
            return;
          }
          if (!nif) {
            setError("Veuillez entrer votre NIF.");
            return;
          }
          if (!nom) {
            setError("Veuillez entrer votre nom.");
            return;
          }
          setStep(2);
          break;
        case 2:
          // Vérifie les champs de l’étape 2
          if (!montant) {
            setError("Veuillez entrer le montant à payer.");
            return;
          }
          if (!periode) {
            setError("Veuillez sélectionner la période fiscale.");
            return;
          }
          setStep(3);
          break;
        case 3:
          // Vérifie si le mode de paiement est choisi
          if (!modePaiement) {
            setError("Veuillez sélectionner le mode de paiement.");
            return;
          }
          setStep(4);
          break;
        case 4:
          // Vérifie le code PIN avant validation finale
          if (!codePin) {
            setError("Veuillez entrer votre code PIN pour valider.");
            return;
          }
          alert("Paiement des impôts effectué avec succès !");
          resetForm(); // Réinitialise le formulaire
          break;
        default:
          break;
      }
    }, 500); // Petite simulation de délai (loader)
  };

  // Revenir à l’étape précédente
  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setStep(1);
    setImpotType("");
    setNif("");
    setNom("");
    setMontant("");
    setPeriode("");
    setModePaiement("");
    setCodePin("");
    setError("");
  };

  // Variants d’animation pour chaque étape
  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="max-w-md mx-auto mt-5 bg-white shadow-xl rounded-xl p-6 relative">
      {/* Titre principal */}
      <h1 className="text-3xl font-bold text-center mb-4 flex items-center justify-center space-x-2">
       
        <span>Paiement Impôts</span>
      </h1>

      {/* Indicateur d’avancement par étapes */}
      <div className="flex justify-center space-x-2 mb-4">
        {[1,2,3,4].map(n => (
          <div key={n} className={`w-4 h-4 rounded-full ${step >= n ? 'bg-orange-500' : 'bg-gray-300'}`} />
        ))}
      </div>

      {/* Contenu des étapes avec animation */}
      <AnimatePresence mode="wait">
        <motion.div key={step} variants={stepVariants} initial="hidden" animate="visible" exit="exit" 
        className="space-y-4">
          
          {/* Étape 1 : Informations fiscales */}
          {step === 1 && (
            <div className="space-y-2">
              <p className="font-semibold">1. Informations fiscales</p>
              <select
                value={impotType}
                onChange={e => setImpotType(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">-- Sélectionnez le type d'impôt --</option>
                {impots.map((imp, i) => <option key={i} value={imp}>{imp}</option>)}
              </select>
              <input
                type="text"
                value={nif}
                onChange={e => setNif(e.target.value)}
                placeholder="Identifiant fiscal (NIF)"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                value={nom}
                onChange={e => setNom(e.target.value)}
                placeholder="Nom du contribuable"
                className="w-full p-2 border rounded"
              />
            </div>
          )}

          {/* Étape 2 : Montant et période */}
          {step === 2 && (
            <div className="space-y-2">
              <p className="font-semibold">2. Montant et période</p>
              <input
                type="text"
                value={montant}
                onChange={e => setMontant(e.target.value)}
                placeholder="Montant à payer"
                className="w-full p-2 border rounded"
              />
              <select
                value={periode}
                onChange={e => setPeriode(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">-- Sélectionnez la période --</option>
                {periodes.map((p, i) => <option key={i} value={p}>{p}</option>)}
              </select>
            </div>
          )}

          {/* Étape 3 : Mode de paiement */}
          {step === 3 && (
            <div className="space-y-2">
              <p className="font-semibold">3. Mode de paiement</p>
              <select
                value={modePaiement}
                onChange={e => setModePaiement(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">-- Sélectionnez --</option>
                <option value="Airtel Money">Airtel Money</option>
                <option value="Orange Money">Orange Money</option>
                <option value="Lumicash">Lumicash</option>
                <option value="Carte bancaire">Carte bancaire</option>
              </select>
            </div>
          )}

          {/* Étape 4 : Confirmation par PIN */}
          {step === 4 && (
            <div className="space-y-2">
              <p className="font-semibold text-center">4. Confirmez le paiement</p>
              <input
                type="password"
                value={codePin}
                onChange={e => setCodePin(e.target.value)}
                placeholder="Entrez votre code PIN"
                className="w-full p-2 border rounded text-center"
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Affichage des erreurs */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Loader (petit spinner) */}
      {isLoading && (
        <div className="flex justify-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-8 w-8">            
          </div>
        </div>
      )}

      {/* Boutons navigation (Précédent / Suivant) */}
      <div className="flex justify-between space-x-4 mt-4">
        {step > 1 && (
          <button
            onClick={handlePrev}
            disabled={isLoading}
            className="w-1/2 bg-gray-300 text-orange-500 py-2 rounded-full 
            font-semibold hover:bg-gray-400 transition disabled:opacity-50"
          >
            Précédent
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={isLoading}
          className={`w-full ${step>1 ? 'w-1/2':'w-full'} bg-orange-500 text-white
           py-2 rounded-full font-semibold hover:bg-orange-600 transition disabled:opacity-50`}
        >
          {step < 4 ? 'Suivant' : 'Valider'}
        </button>
      </div>

      {/* Barre de navigation en bas */}
      <BottomNav />

      {/* Style pour loader */}
      <style>{`
        .loader {
          border-top-color: #f97316;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
