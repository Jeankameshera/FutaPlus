import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import api from '@/api/api';
import { useToast } from '@/hooks/use-toast';

const InternetForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [provider, setProvider] = useState('');
  const [accountId, setAccountId] = useState('');
  const [plan, setPlan] = useState('');
  const [price, setPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [service, setService] = useState(null);
  const [token, setToken] = useState('');

  // Charger le service Internet
  useEffect(() => {
    const fetchService = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/services');
        const internetService = response.data.find(
          s => s.slug === 'internet' || 
               s.name.toLowerCase().includes('internet') ||
               s.name.toLowerCase().includes('data')
        );
        
        if (!internetService) {
          throw new Error('Service Internet non trouvé.');
        }
        setService(internetService);
        
        // Charger les plans depuis le service
        if (internetService.plans && internetService.plans.length > 0) {
          setPlans(internetService.plans);
        } else {
          // Fallback aux plans par défaut
          setPlans([
            { name: "5 Go", price: 10000 },
            { name: "10 Go", price: 18000 },
            { name: "Illimité", price: 30000 },
            { name: "2 Go", price: 5000 },
            { name: "3 Go", price: 8000 },
            { name: "50 Mbps illimité", price: 60000 },
            { name: "100 Mbps illimité", price: 100000 }
          ]);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération du service:', err);
        setError('Service Internet non disponible.');
        toast({
          title: 'Erreur',
          description: 'Le service Internet est temporairement indisponible.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchService();
  }, [toast]);

  // Gérer le changement de plan
  const handlePlanChange = (value) => {
    setPlan(value);
    const selectedPlan = plans.find(p => p.name === value);
    if (selectedPlan) {
      setPrice(selectedPlan.price);
    } else {
      setPrice(0);
    }
  };

  // Gérer l'étape suivante
  const handleNext = async () => {
    setError('');
    setIsLoading(true);

    try {
      switch (step) {
        case 1:
          // À l'étape 1, on passe simplement à l'étape 2 sans validation
          setStep(2);
          break;
        case 2:
          if (!provider) {
            setError('Veuillez sélectionner un fournisseur.');
            return;
          }
          setStep(3);
          break;
        case 3:
          if (!accountId) {
            setError('Veuillez entrer un identifiant de compte.');
            return;
          }
          setStep(4);
          break;
        case 4:
          if (!plan) {
            setError('Veuillez sélectionner un plan.');
            return;
          }
          setStep(5);
          break;
        case 5:
          setStep(6);
          break;
        case 6:
          if (!paymentMethod) {
            setError('Veuillez sélectionner un mode de paiement.');
            return;
          }
          setStep(7);
          break;
        case 7:
          if (!phone || !/^\d+$/.test(phone)) {
            setError('Veuillez entrer un numéro de téléphone valide.');
            return;
          }
          if (!pin || !/^\d+$/.test(pin)) {
            setError('Veuillez entrer un code PIN valide.');
            return;
          }
          
          // STRUCTURE SIMILAIRE À CASHPOWER - avec invoice_numbers vide
          const paymentData = {
            service_id: service?.id || 3, // Internet
            amount: price,
            payment_method: paymentMethod,
            phone_number: phone,
            pin: pin,
            plan: plan,
            invoice_numbers: [] // Tableau vide pour satisfaire la validation
          };

          console.log('Données envoyées au backend:', paymentData);

          const response = await api.post('/payment', paymentData);
          
          if (response.data && response.data.token) {
            setToken(response.data.token);
            setStep(8);
            toast({
              title: 'Succès',
              description: 'Forfait Internet activé avec succès !',
            });
          } else {
            throw new Error('Token non reçu dans la réponse');
          }
          break;
        case 8:
          resetForm();
          navigate('/dashboard');
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

  // Gérer l'étape précédente
  const handlePrev = () => {
    if (step > 1) {
      setError('');
      setStep(step - 1);
    }
  };

  // Retour au dashboard
  const goBackToDashboard = () => navigate('/dashboard');

  // Réinitialiser le formulaire
  const resetForm = () => {
    setStep(1);
    setProvider('');
    setAccountId('');
    setPlan('');
    setPrice(0);
    setPaymentMethod('');
    setPhone('');
    setPin('');
    setToken('');
    setError('');
  };

  // Animation des étapes
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

      <h1 className="text-3xl font-bold text-center">{service?.name || 'Internet'}</h1>

      <div className="flex justify-center space-x-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
          <div key={n} className={`w-3 h-3 rounded-full ${step >= n ? 'bg-orange-400' : 'bg-gray-300'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={stepVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="space-y-4"
        >
          {step === 1 && (
            <div className="space-y-4">
              <p className="font-semibold text-center">Voulez-vous acheter un forfait Internet ?</p>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-center">Service : {service?.name || 'Internet'}</p>
                <p className="text-center text-sm text-gray-600 mt-2">
                  Achetez des forfaits data pour vos fournisseurs Internet
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <p className="font-semibold">Choisissez le fournisseur</p>
              <select
                value={provider}
                onChange={e => setProvider(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">-- Sélectionner --</option>
                <option value="BBS">BBS</option>
                <option value="CBINET">CBINET</option>
                <option value="Onatel">Onatel</option>
                <option value="Swiftsat">Swiftsat</option>
                <option value="Starlink">Starlink</option>
                <option value="LTE">LTE</option>
              </select>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-2">
              <p className="font-semibold">Entrez votre identifiant de compte</p>
              <input
                type="text"
                value={accountId}
                onChange={e => setAccountId(e.target.value)}
                placeholder="Votre identifiant / compte ISP"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-2">
              <p className="font-semibold">Choisissez le plan / forfait</p>
              <select
                value={plan}
                onChange={e => handlePlanChange(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">-- Sélectionner --</option>
                {plans.map(p => (
                  <option key={p.name} value={p.name}>
                    {p.name} — {p.price.toLocaleString()} BIF
                  </option>
                ))}
              </select>
              {plan && (
                <p className="text-sm text-green-600 font-semibold">
                  Montant : {price.toLocaleString()} BIF
                </p>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-2">
              <p className="font-semibold">Résumé de votre achat</p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p><strong>Service :</strong> {service?.name || 'Internet'}</p>
                <p><strong>Fournisseur :</strong> {provider}</p>
                <p><strong>Identifiant :</strong> {accountId}</p>
                <p><strong>Forfait :</strong> {plan}</p>
                <p><strong>Montant :</strong> {price.toLocaleString()} BIF</p>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-2">
              <p className="font-semibold">Choisissez le mode de paiement</p>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">-- Sélectionner --</option>
                <option value="Airtel Money">Airtel Money</option>
                <option value="Orange Money">Orange Money</option>
                <option value="Lumicash">Lumicash</option>
                <option value="Cashtel">Cashtel</option>
              </select>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-2">
              <p className="font-semibold text-center">Validation</p>
              <p className="text-sm text-gray-500 text-center">
                Saisissez votre numéro de téléphone et votre PIN pour valider le paiement
              </p>
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

          {step === 8 && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-semibold text-xl text-green-600">Forfait activé avec succès !</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-center text-sm text-gray-600">Votre code d'activation :</p>
                <p className="text-center font-mono text-2xl font-bold bg-white p-4 rounded-lg border-2 border-orange-400">{token}</p>
                <p className="text-center text-sm text-gray-600">Forfait : {plan}</p>
                <p className="text-center text-xs text-gray-500">
                  Utilisez ce code pour activer votre forfait {provider}
                </p>
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
        {step > 1 && step < 8 && (
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
          className={`${step > 1 && step < 8 ? 'w-1/2' : 'w-full'} bg-orange-400 text-white py-2 rounded-full font-semibold hover:bg-orange-500 transition disabled:opacity-50`}
        >
          {step < 7 ? 'Suivant' : (step === 7 ? 'Valider' : 'Terminer')}
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
};

export default InternetForm;