import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';

export default function RegidesoForm() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [typePaiement] = useState('PostPaid');
  const [compteur, setCompteur] = useState('');
  const [factures, setFactures] = useState([]);
  const [selectedFactures, setSelectedFactures] = useState([]);
  const [montant, setMontant] = useState('');
  const [modePaiement, setModePaiement] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      switch (step) {
        case 1:
          setStep(2);
          break;
        case 2:
          if (!/^[0-9]+$/.test(compteur)) {
            setError("Le numéro de compteur doit contenir uniquement des chiffres.");
            return;
          }

          setFactures([
            { id: 1, mois: 'Avril', montant: 10000 },
            { id: 2, mois: 'Mars', montant: 9500 },
            { id: 3, mois: 'Février', montant: 8700 },
          ]);
          setSelectedFactures([]);
          setStep(3);
          break;
        case 3:
          if (selectedFactures.length === 0) {
            setError("Veuillez sélectionner au moins une facture.");
            return;
          }
          setMontant(selectedFactures.reduce((total, id) => {
            const facture = factures.find(f => f.id === id);
            return total + (facture ? facture.montant : 0);
          }, 0).toString());
          setStep(4);
          break;
        case 4:
          setStep(5);
          break;
        case 5:
          if (!modePaiement) {
            setError("Veuillez choisir un mode de paiement.");
            return;
          }
          setStep(6);
          break;
        case 6:
          alert("Paiement effectué avec succès !");
          resetForm();
          break;
        default:
          break;
      }
    }, 1000);
  };

  const handlePrev = () => {
    if (step > 1) {
      setError('');
      setStep(step - 1);
    }
  };

  const goBackToDashboard = () => navigate('/dashboard');

  const handleCompteurChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) setCompteur(value);
  };

  const handleFactureToggle = (id) => {
    setSelectedFactures((prev) =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const handleMontantChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) setMontant(value);
  };

  const resetForm = () => {
    setStep(1);
    setCompteur('');
    setFactures([]);
    setSelectedFactures([]);
    setMontant('');
    setModePaiement('');
    setError('');
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="max-w-md mx-auto mt-5 bg-white shadow-xl rounded-xl p-8 space-y-6 relative">
      <button onClick={goBackToDashboard} className="absolute top-4 left-4 flex items-center text-orange-500 hover:text-orange-600 transition">
        <ArrowLeft className="w-5 h-5 mr-1" />
        <span className="font-semibold text-md">Retour</span>
      </button>

      <h1 className="text-3xl font-bold text-center">REGIDESO</h1>

      <div className="flex justify-center space-x-2">
        {[1, 2, 3, 4, 5].map(n => (
          <div key={n} className={`w-4 h-4 rounded-full ${step >= n ? 'bg-orange-400' : 'bg-gray-300'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
          {step === 1 && (
            <div className="space-y-2">
              <p className="font-semibold">Jean Kameshera, voulez-vous payer?</p>
              <div className="bg-gray-100 rounded-lg p-3">
                <p>{typePaiement} (Payer une Facture)</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <p className="font-semibold">Entrez votre numéro de compteur</p>
              <input
                type="text"
                value={compteur}
                onChange={handleCompteurChange}
                placeholder="Ex: 1122345585"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-2">
              <p className="font-semibold">Factures disponibles</p>
              {factures.map(f => (
                <label key={f.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedFactures.includes(f.id)}
                    onChange={() => handleFactureToggle(f.id)}
                  />
                  <span>{f.mois} - {f.montant.toLocaleString()} BIF</span>
                </label>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-2">
              <p className="font-semibold">Montant calculé automatiquement</p>
              <div className="flex items-center border rounded-lg px-4">
                <span className="text-gray-500 mr-2">BIF</span>
                <input
                  type="text"
                  value={montant}
                  onChange={handleMontantChange}
                  className="flex-1 py-2 outline-none"
                  placeholder="Montant"
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-2">
              <p className="font-semibold">Choisissez le mode de paiement</p>
              <select
                value={modePaiement}
                onChange={e => setModePaiement(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >                
                <option value="">-- Sélectionnez --</option>  
                <option value="Mobile Money">Airtel Money</option>
                <option value="Mobile Money">Orange Money</option>                
                <option value="Lumicash">Lumicash</option>
                <option value="Pesaflash">Pesaflash</option>
              </select>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-2">
              <p className="font-semibold">Résumé</p>
              <p><strong>Numéro compteur:</strong> {compteur}</p>
              <p><strong>Factures:</strong> {selectedFactures.map(id => factures.find(f => f.id === id)?.mois).join(', ')}</p>
              <p><strong>Montant:</strong> {montant} BIF</p>
              <p><strong>Mode de paiement:</strong> {modePaiement}</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {error && <p className="text-red-500 whitespace-pre-line text-sm">{error}</p>}

      {isLoading && (
        <div className="flex justify-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-8 w-8"></div>
        </div>
      )}

      <div className="flex justify-between space-x-4">
        {step > 1 && (
          <button
            onClick={handlePrev}
            disabled={isLoading}
            className="w-1/2 bg-gray-300 text-orange-500 py-2 rounded-full font-semibold hover:bg-gray-400 transition disabled:opacity-50"
          >
            Précédent
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={isLoading}
          className={`w-full ${step > 1 ? 'w-1/2' : 'w-full'} bg-orange-400 text-white py-2 rounded-full font-semibold hover:bg-orange-500 transition disabled:opacity-50`}
        >
          {step < 6 ? 'Suivant' : 'Valider'}
        </button>
      </div>

      <BottomNav />

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

