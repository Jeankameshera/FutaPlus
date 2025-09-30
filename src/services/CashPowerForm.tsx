// src/pages/CashPowerForm.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';

export default function CashPowerForm() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [fournisseur, setFournisseur] = useState('REGIDESO');
  const [compteur, setCompteur] = useState('');
  const [montant, setMontant] = useState('');
  const [kwh, setKwh] = useState(0);
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const prixParKwh = 500; // BIF par kWh

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
          if (!/^\d+$/.test(compteur)) {
            setError('Le numéro de compteur doit contenir uniquement des chiffres.');
            return;
          }
          setStep(3);
          break;
        case 3:
          if (!/^\d+$/.test(montant) || Number(montant) <= 0) {
            setError('Veuillez entrer un montant valide.');
            return;
          }
          setKwh(Number(montant) / prixParKwh);
          setStep(4);
          break;
        case 4:
          setStep(5);
          break;
        case 5:
          if (!phone || !pin) {
            setError('Veuillez entrer votre numéro de téléphone et votre PIN.');
            return;
          }
          // Génération du code Cash Power simulé
          
         const generatedToken = Math.floor(100000000 + Math.random() * 900000000);
         setToken(generatedToken.toString());
          setStep(6);
          break;
        case 6:
          resetForm();
          navigate('/dashboard');
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

  const resetForm = () => {
    setStep(1);
    setCompteur('');
    setMontant('');
    setKwh(0);
    setPhone('');
    setPin('');
    setToken('');
    setError('');
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="max-w-md mx-auto mt-5 bg-white shadow-xl rounded-xl p-8 space-y-6 relative">
     

      <h1 className="text-3xl font-bold text-center">Cash Power Electricité</h1>

      <div className="flex justify-center space-x-2">
        {[1, 2, 3, 4, 5, 6].map(n => (
          <div key={n} className={`w-4 h-4 rounded-full ${step >= n ? 'bg-orange-400' : 'bg-gray-300'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
          
          {step === 1 && (
            <div className="space-y-2">
              <p className="font-semibold">Voulez-vous acheter du Cash Power ?</p>
              <div className="bg-gray-100 rounded-lg p-3">
                <p>Fournisseur : {fournisseur}</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <p className="font-semibold">Entrez votre numéro de compteur</p>
              <input
                type="text"
                value={compteur}
                onChange={e => setCompteur(e.target.value)}
                placeholder="Ex: 12345678"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-2">
              <p className="font-semibold">Montant à acheter</p>
              <input
                type="text"
                value={montant}
                onChange={e => setMontant(e.target.value)}
                placeholder="Ex: 10000 BIF"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-2">
              <p className="font-semibold">Résumé de votre achat</p>
              <p><strong>Fournisseur :</strong> {fournisseur}</p>
              <p><strong>Numéro compteur :</strong> {compteur}</p>
              <p><strong>Montant :</strong> {montant} BIF</p>
              <p><strong>Quantité :</strong> {kwh} kWh</p>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-2">
              <p className="font-semibold text-center">Validation</p>
              <p className="text-sm text-gray-500 text-center">Saisissez votre numéro de téléphone et 
                votre PIN pour valider le paiement</p>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Numéro de téléphone"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-center"
              />
              <input
                type="password"
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder="PIN"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2
                 focus:ring-black text-center mt-2 tracking-widest"
              />
            </div>
          )}

          {step === 6 && (
            <div className="space-y-2">
              <p className="font-semibold text-center text-green-600">Paiement effectué avec succès !</p>
              <p className="text-center">Voici votre code Cash Power :</p>
              <p className="text-center font-mono text-xl">{token}</p>
              <p className="text-center text-gray-500">{kwh} kWh sera crédité sur votre compteur</p>
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
        {step > 1 && step < 6 && (
          <button
            onClick={handlePrev}
            disabled={isLoading}
            className="w-1/2 bg-gray-300 text-orange-500 py-2 rounded-full font-semibold
            hover:bg-gray-400 transition disabled:opacity-50"
          >
            Précédent
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={isLoading}
          className={`w-full ${step > 1 && step < 6 ? 'w-1/2' : 'w-full'} bg-orange-400 
          text-white py-2 rounded-full font-semibold hover:bg-orange-500 transition disabled:opacity-50`}
        >
          {step < 6 ? 'Suivant' : 'Terminer'}
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
