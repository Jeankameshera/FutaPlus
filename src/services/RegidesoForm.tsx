import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import api from '@/api/api';
import { useToast } from '@/hooks/use-toast';

export default function RegidesoForm() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [typePaiement] = useState('PostPaid');
  const [compteur, setCompteur] = useState('');
  const [factures, setFactures] = useState([]);
  const [selectedFactures, setSelectedFactures] = useState([]);
  const [montant, setMontant] = useState('');
  const [modePaiement, setModePaiement] = useState('');
  const [numeroTelephone, setNumeroTelephone] = useState('');
  const [validationCode, setValidationCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [service, setService] = useState(null);

  // Charger les informations du service au montage
  useEffect(() => {
    const fetchService = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/services');
        const regidesoService = response.data.find(s => s.slug === 'regideso' || s.name.toLowerCase().includes('regideso'));
        if (!regidesoService) {
          throw new Error('Service Regideso non trouvé.');
        }
        setService(regidesoService);
      } catch (err) {
        console.error('Erreur lors de la récupération du service:', err);
        setError('Erreur lors du chargement du service Regideso.');
        toast({
          title: 'Erreur',
          description: 'Impossible de charger le service Regideso.',
          variant: 'destructive',
        });
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    fetchService();
  }, [toast, navigate]);

  // Charger les factures à l'étape 3
  useEffect(() => {
    if (step === 3 && compteur && service) {
      const fetchInvoices = async () => {
        setIsLoading(true);
        try {
          const response = await api.get(`/services/${encodeURIComponent(service.name)}/invoices?meter=${compteur}`);
          setFactures(response.data || []);
        } catch (err) {
          if (err.response?.data?.error === 'No unpaid invoices found') {
            setFactures([]);
          } else {
            console.error('Erreur lors de la récupération des factures:', err);
            setError('Erreur lors du chargement des factures.');
            toast({
              title: 'Erreur',
              description: 'Impossible de charger les factures.',
              variant: 'destructive',
            });
          }
        } finally {
          setIsLoading(false);
        }
      };
      fetchInvoices();
    }
  }, [step, compteur, service, toast]);

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
          if (!/^[0-9]+$/.test(compteur)) {
            setError('Le numéro de compteur doit contenir uniquement des chiffres.');
            return;
          }
          setStep(3);
          break;
        case 3:
          if (factures.length === 0) {
            setError('Aucune facture disponible pour ce compteur.');
            return;
          }
          if (selectedFactures.length === 0) {
            setError('Veuillez sélectionner au moins une facture.');
            return;
          }
          setMontant(
            selectedFactures
              .reduce((total, id) => {
                const facture = factures.find(f => f.id === id);
                return total + (facture ? facture.amount : 0);
              }, 0)
              .toString()
          );
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
          setStep(7);
          break;
        case 7:
          if (!numeroTelephone) {
            setError('Veuillez entrer le numéro de téléphone de votre portefeuille.');
            return;
          }
          if (!validationCode || !/^\d{4}$/.test(validationCode)) {
            setError('Veuillez entrer un code PIN valide (4 chiffres).');
            return;
          }
          await api.post('/payment', {
            service_id: service?.id,
            invoice_numbers: selectedFactures,
            payment_method: modePaiement,
            phone_number: numeroTelephone,
            pin: validationCode,
            user_id: JSON.parse(atob(localStorage.getItem('token')?.split('.')[1] || '{}')).sub,
          });
          toast({
            title: 'Succès',
            description: 'Paiement validé avec succès !',
          });
          resetForm();
          navigate('/history');
          break;
        default:
          break;
      }
    } catch (err) {
      console.error('Erreur lors de la validation du paiement:', err);
      setError('Erreur lors de la validation du paiement.');
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
    setNumeroTelephone('');
    setValidationCode('');
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

      <h1 className="text-3xl font-bold text-center">{service?.name || 'REGIDESO'}</h1>

      <div className="flex justify-center space-x-2">
        {[1, 2, 3, 4, 5, 6, 7].map(n => (
          <div key={n} className={`w-4 h-4 rounded-full ${step >= n ? 'bg-orange-400' : 'bg-gray-300'}`} />
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
            <div className="space-y-2">
              <p className="font-semibold">Jean Kameshera, voulez-vous payer?</p>
              <div className="bg-gray-100 rounded-lg p-3">
                <p>{typePaiement}</p>
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
                placeholder="Ex: 12345678"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-2">
              <p className="font-semibold">Factures disponibles</p>
              {factures.length > 0 ? (
                factures.map(f => (
                  <label key={f.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedFactures.includes(f.id)}
                      onChange={() => handleFactureToggle(f.id)}
                    />
                    <span>{f.month} - {f.amount.toLocaleString()} BIF</span>
                  </label>
                ))
              ) : (
                <p className="text-gray-500">Aucune facture disponible.</p>
              )}
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
                <option value="Airtel Money">Airtel Money</option>
                <option value="Orange Money">Orange Money</option>
                <option value="Lumicash">Lumicash</option>
                <option value="Pesaflash">Pesaflash</option>
              </select>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-2">
              <p className="font-semibold">Résumé</p>
              <p><strong>Numéro compteur:</strong> {compteur}</p>
              <p><strong>Factures:</strong> {selectedFactures.map(id => factures.find(f => f.id === id)?.month).join(', ')}</p>
              <p><strong>Montant:</strong> {montant} BIF</p>
              <p><strong>Mode de paiement:</strong> {modePaiement}</p>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-2">
              <p className="font-semibold text-center">Voulez-vous valider cette action ?</p>
              <p className="text-sm text-gray-500 text-center">Entrez les informations de votre portefeuille</p>
              <input
                type="text"
                value={numeroTelephone}
                onChange={e => setNumeroTelephone(e.target.value)}
                placeholder="Numéro de téléphone"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-center"
              />
              <input
                type="password"
                value={validationCode}
                onChange={e => setValidationCode(e.target.value)}
                placeholder="PIN"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-center tracking-widest"
              />
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
          disabled={isLoading || !service}
          className={`w-full ${step > 1 ? 'w-1/2' : 'w-full'} bg-orange-400 text-white py-2 rounded-full font-semibold hover:bg-orange-500 transition disabled:opacity-50`}
        >
          {step < 7 ? 'Suivant' : 'Valider'}
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