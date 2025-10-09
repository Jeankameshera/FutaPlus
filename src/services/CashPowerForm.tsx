import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import api from '@/api/api';

export default function CashPowerForm() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [compteur, setCompteur] = useState('');
  const [montant, setMontant] = useState('');
  const [kwh, setKwh] = useState(0);
  const [modePaiement, setModePaiement] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [service, setService] = useState(null);

  const prixParKwh = 500;

  // Chargement du service CashPower
  useEffect(() => {
    const fetchService = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/services');
        const cashpowerService = response.data.find(
          s => s.slug === 'cashpower' || 
               s.name.toLowerCase().includes('cashpower') ||
               s.name.toLowerCase().includes('electricité') ||
               s.name.toLowerCase().includes('electricite')
        );
        
        if (!cashpowerService) {
          throw new Error('Service CashPower non trouvé.');
        }

        setService(cashpowerService);
      } catch (err) {
        console.error('Erreur lors de la récupération du service:', err);
        setError('Service CashPower non disponible.');
        toast({
          title: 'Erreur',
          description: 'Le service CashPower est temporairement indisponible.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchService();
  }, [toast, navigate]);

  const handleNext = async () => {
    setError('');
    setIsLoading(true);

    try {
      switch (step) {
        case 1:
          if (!service) {
            setError('Service non disponible. Veuillez réessayer.');
            return;
          }
          setStep(2);
          break;
        case 2:
          if (!/^\d+$/.test(compteur) || compteur.length < 6) {
            setError('Le numéro de compteur doit contenir au moins 6 chiffres.');
            return;
          }
          setStep(3);
          break;
        case 3:
          if (!/^\d+$/.test(montant) || Number(montant) < 1000) {
            setError('Le montant minimum est de 1 000 BIF.');
            return;
          }
          setKwh(Number(montant) / prixParKwh);
          setStep(4);
          break;
        case 4:
          setStep(5);
          break;
        case 5:
          if (!modePaiement) {
            setError('Veuillez choisir un mode de paiement.');
            return;
          }
          setStep(6);
          break;
        case 6:
          if (!phone || !/^\d+$/.test(phone)) {
            setError('Veuillez entrer un numéro de téléphone valide.');
            return;
          }
          if (!pin || !/^\d+$/.test(pin)) {
            setError('Veuillez entrer un code PIN valide.');
            return;
          }
          
          // STRUCTURE IDENTIQUE À REGIDESO - avec invoice_numbers vide
          const paymentData = {
            service_id: service.id,
            amount: Number(montant),
            payment_method: modePaiement,
            phone_number: phone,
            pin: pin,
            invoice_numbers: [] // Tableau vide pour satisfaire la validation
          };

          console.log('Données envoyées au backend:', paymentData);

          // Appel API
          const response = await api.post('/payment', paymentData);
          
          if (response.data && response.data.token) {
            setToken(response.data.token);
            setStep(7);
            toast({
              title: 'Succès',
              description: 'Paiement validé avec succès !',
            });
          } else {
            throw new Error('Token non reçu dans la réponse');
          }
          break;
        case 7:
          resetForm();
          navigate('/history');
          break;
        default:
          break;
      }
    } catch (err) {
      console.error('Erreur détaillée:', err);
      
      const errorMessage = err.response?.data?.error 
        ? `Erreur serveur: ${err.response.data.error}` 
        : 'Erreur réseau. Vérifiez votre connexion.';
      
      setError(errorMessage);
      
      toast({
        title: 'Erreur',
        description: 'Impossible de valider le paiement.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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
    setModePaiement('');
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
      <button 
        onClick={goBackToDashboard}
        className="absolute top-4 left-4 flex items-center text-orange-500 hover:text-orange-600 transition"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
      </button>

      <h1 className="text-3xl font-bold text-center">{service?.name || 'Cash Power Électricité'}</h1>

      <div className="flex justify-center space-x-2">
        {[1, 2, 3, 4, 5, 6, 7].map(n => (
          <div key={n} className={`w-3 h-3 rounded-full ${step >= n ? 'bg-orange-400' : 'bg-gray-300'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
          {step === 1 && (
            <div className="space-y-2">
              <p className="font-semibold">Voulez-vous acheter du Cash Power ?</p>
              <div className="bg-gray-100 rounded-lg p-3">
                <p>Fournisseur : {service?.name || 'CashPower'}</p>
                {service && (
                  <p className="text-sm text-gray-600">Type: {service.type} | ID: {service.id}</p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <p className="font-semibold">Entrez votre numéro de compteur</p>
              <input
                type="text"
                value={compteur}
                onChange={e => setCompteur(e.target.value.replace(/\D/g, ''))}
                placeholder="Ex: 12345678"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-2">
              <p className="font-semibold">Montant à acheter</p>
              <div className="flex items-center border rounded-lg px-4">
                <span className="text-gray-500 mr-2">BIF</span>
                <input
                  type="text"
                  value={montant}
                  onChange={e => setMontant(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ex: 10000"
                  className="flex-1 py-2 outline-none"
                />
              </div>
              <p className="text-sm text-gray-500">≈ {montant ? (Number(montant) / prixParKwh).toFixed(2) : '0'} kWh</p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-2">
              <p className="font-semibold">Résumé de votre achat</p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p><strong>Fournisseur :</strong> {service?.name || 'CashPower'}</p>
                <p><strong>Numéro compteur :</strong> {compteur}</p>
                <p><strong>Montant :</strong> {Number(montant).toLocaleString()} BIF</p>
                <p><strong>Quantité :</strong> {kwh.toFixed(2)} kWh</p>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-2">
              <p className="font-semibold">Choisissez le mode de paiement</p>
              <select
                value={modePaiement}
                onChange={e => setModePaiement(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">-- Sélectionnez --</option>
                <option value="Airtel Money">Airtel Money</option>
                <option value="Orange Money">Orange Money</option>
                <option value="Lumicash">Lumicash</option>
                <option value="Cashtel">Cashtel</option>
              </select>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-2">
              <p className="font-semibold text-center">Validation</p>
              <p className="text-sm text-gray-500 text-center">Saisissez votre numéro de téléphone et votre PIN pour valider le paiement</p>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="Numéro de téléphone"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-center"
              />
              <input
                type="password"
                value={pin}
                onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="PIN"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-center tracking-widest"
              />
            </div>
          )}

          {step === 7 && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-semibold text-xl text-green-600">Paiement effectué avec succès !</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-center text-sm text-gray-600">Voici votre code Cash Power :</p>
                <p className="text-center font-mono text-2xl font-bold bg-white p-4 rounded-lg border-2 border-orange-400">{token}</p>
                <p className="text-center text-sm text-gray-600">Quantité : {kwh.toFixed(2)} kWh</p>
                <p className="text-center text-xs text-gray-500">Entrez ce code sur votre compteur pour recharger</p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm whitespace-pre-line">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-8 w-8"></div>
        </div>
      )}

      <div className="flex justify-between space-x-4">
        {step > 1 && step < 7 && (
          <button
            onClick={handlePrev}
            disabled={isLoading}
            className="w-1/2 bg-gray-300 text-gray-700 py-2 rounded-full font-semibold hover:bg-gray-400 transition disabled:opacity-50"
          >
            Précédent
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={isLoading || !service}
          className={`${step > 1 && step < 7 ? 'w-1/2' : 'w-full'} bg-orange-400 text-white py-2 rounded-full font-semibold hover:bg-orange-500 transition disabled:opacity-50`}
        >
          {step < 7 ? 'Suivant' : 'Terminer'}
        </button>
      </div>

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