import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import api from '@/api/api';
import { useToast } from '@/hooks/use-toast';

const ImpotsForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [impotType, setImpotType] = useState('');
  const [nif, setNif] = useState('');
  const [nom, setNom] = useState('');
  const [montant, setMontant] = useState('');
  const [periode, setPeriode] = useState('');
  const [modePaiement, setModePaiement] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [service, setService] = useState(null);
  const [factures, setFactures] = useState([]);
  const [selectedFactures, setSelectedFactures] = useState([]);
  const [loadingFactures, setLoadingFactures] = useState(false);

  // Types d'impôts disponibles
  const impots = [
    "Impôt sur le revenu",
    "Taxe sur la valeur ajoutée (TVA)",
    "Impôt foncier",
    "Impôt sur les sociétés",
    "Droits de timbre / Taxe administrative",
    "Autres taxes locales"
  ];

  // Périodes fiscales
  const periodes = ["Mois", "Trimestre", "Année"];

  // Charger le service Impôts
  useEffect(() => {
    const fetchService = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/services');
        const impotsService = response.data.find(
          s => s.slug === 'impots' || 
               s.name.toLowerCase().includes('impôt') ||
               s.name.toLowerCase().includes('impot') ||
               s.name.toLowerCase().includes('taxe') ||
               s.name.toLowerCase().includes('fiscal')
        );
        
        if (!impotsService) {
          throw new Error('Service Impôts non trouvé.');
        }
        setService(impotsService);
      } catch (err) {
        console.error('Erreur lors de la récupération du service:', err);
        setError('Service Impôts non disponible.');
        toast({
          title: 'Erreur',
          description: 'Le service Impôts est temporairement indisponible.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchService();
  }, [toast]);

  // Récupérer les déclarations fiscales depuis l'API
  useEffect(() => {
    if (step === 4 && nif && service) {
      const fetchFiscalInvoices = async () => {
        setLoadingFactures(true);
        setError('');
        try {
          // Appel API réel pour récupérer les déclarations impayées
          const response = await api.get(`/services/${encodeURIComponent(service.name)}/invoices?meter=${nif}`);
          
          if (response.data && Array.isArray(response.data)) {
            setFactures(response.data);
            console.log('Déclarations récupérées:', response.data);
          } else {
            setFactures([]);
          }
        } catch (err) {
          if (err.response?.status === 404 || err.response?.data?.error === 'No unpaid invoices found') {
            setFactures([]);
            console.log('Aucune déclaration impayée trouvée pour ce NIF');
          } else {
            console.error('Erreur lors de la récupération des déclarations:', err);
            setError('Erreur lors du chargement des déclarations fiscales.');
          }
          setFactures([]);
        } finally {
          setLoadingFactures(false);
        }
      };
      fetchFiscalInvoices();
    } else {
      // Réinitialiser les factures quand on quitte l'étape 4
      setFactures([]);
      setSelectedFactures([]);
    }
  }, [step, nif, service]);

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
          if (!impotType) {
            setError('Veuillez sélectionner le type d\'impôt.');
            return;
          }
          if (!nif) {
            setError('Veuillez entrer votre numéro d\'identification fiscale (NIF).');
            return;
          }
          setStep(3);
          break;
        case 3:
          if (!nom) {
            setError('Veuillez entrer votre nom ou raison sociale.');
            return;
          }
          setStep(4);
          break;
        case 4:
          // Pour les impôts, on peut avoir des factures pré-existantes ou un montant manuel
          if (factures.length === 0 && !montant) {
            setError('Veuillez entrer le montant à payer.');
            return;
          }
          if (factures.length > 0 && selectedFactures.length === 0 && !montant) {
            setError('Veuillez sélectionner au moins une déclaration à payer ou entrer un montant manuel.');
            return;
          }
          setStep(5);
          break;
        case 5:
          setStep(6);
          break;
        case 6:
          if (!modePaiement) {
            setError('Veuillez choisir un mode de paiement.');
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
          
          // Préparer les données pour l'API
          const totalAmount = selectedFactures.length > 0 
            ? selectedFactures.reduce((total, id) => {
                const facture = factures.find(f => f.id === id);
                return total + (facture ? facture.amount : 0);
              }, 0)
            : Number(montant) || 0;

          const paymentData = {
            service_id: service?.id,
            amount: totalAmount,
            payment_method: modePaiement,
            phone_number: phone,
            pin: pin,
            invoice_numbers: selectedFactures.length > 0 ? selectedFactures : []
          };

          console.log('Données envoyées au backend:', paymentData);

          const response = await api.post('/payment', paymentData);
          
          if (response.data && response.data.id) {
            toast({
              title: 'Succès',
              description: 'Paiement des impôts effectué avec succès !',
            });
            resetForm();
            navigate('/history');
          } else {
            throw new Error('Paiement non confirmé');
          }
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

  const handleFactureToggle = (id) => {
    setSelectedFactures((prev) =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
    // Si on sélectionne des factures, on vide le montant manuel
    if (!selectedFactures.includes(id)) {
      setMontant('');
    }
  };

  const resetForm = () => {
    setStep(1);
    setImpotType('');
    setNif('');
    setNom('');
    setMontant('');
    setPeriode('');
    setModePaiement('');
    setPhone('');
    setPin('');
    setFactures([]);
    setSelectedFactures([]);
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

      <h1 className="text-3xl font-bold text-center">{service?.name || 'Impôts & Taxes'}</h1>

      <div className="flex justify-center space-x-2">
        {[1, 2, 3, 4, 5, 6, 7].map(n => (
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
            <div className="space-y-2">
              <p className="font-semibold">Voulez-vous payer vos impôts ?</p>
              <div className="bg-gray-100 rounded-lg p-3">
                <p>Service : {service?.name || 'Impôts & Taxes'}</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <p className="font-semibold">Type d'impôt</p>
              <select
                value={impotType}
                onChange={e => setImpotType(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">-- Sélectionnez le type d'impôt --</option>
                {impots.map((imp, i) => (
                  <option key={i} value={imp}>{imp}</option>
                ))}
              </select>
              
              <p className="font-semibold mt-4">Numéro d'identification fiscale</p>
              <input
                type="text"
                value={nif}
                onChange={e => setNif(e.target.value)}
                placeholder="Votre NIF"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-2">
              <p className="font-semibold">Informations du contribuable</p>
              <input
                type="text"
                value={nom}
                onChange={e => setNom(e.target.value)}
                placeholder="Nom ou raison sociale"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <select
                value={periode}
                onChange={e => setPeriode(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">-- Période fiscale (optionnel) --</option>
                {periodes.map((p, i) => (
                  <option key={i} value={p}>{p}</option>
                ))}
              </select>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              {/* Section Déclarations disponibles */}
              {loadingFactures ? (
                <div className="flex justify-center items-center py-4">
                  <div className="loader ease-linear rounded-full border-2 border-t-2 border-orange-400 h-6 w-6 mr-2"></div>
                  <span className="text-sm text-gray-600">Recherche des déclarations...</span>
                </div>
              ) : factures.length > 0 ? (
                <div className="space-y-2">
                  <p className="font-semibold">Déclarations fiscales impayées</p>
                  <div className="max-h-48 overflow-y-auto border rounded-lg p-2 bg-gray-50">
                    {factures.map(f => (
                      <label key={f.id} className="flex items-center space-x-3 p-3 hover:bg-white rounded-lg border border-gray-200 mb-2 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedFactures.includes(f.id)}
                          onChange={() => handleFactureToggle(f.id)}
                          className="rounded text-orange-500 focus:ring-orange-400"
                        />
                        <span className="flex-1">
                          <span className="font-medium block">{f.month}</span>
                          {f.description && (
                            <span className="text-sm text-gray-600 block">{f.description}</span>
                          )}
                          <span className="text-sm text-green-600 font-semibold block mt-1">
                            {f.amount?.toLocaleString()} BIF
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                  {selectedFactures.length > 0 && (
                    <p className="text-sm text-green-600 font-semibold p-2 bg-green-50 rounded-lg">
                      Total sélectionné: {selectedFactures.reduce((total, id) => total + (factures.find(f => f.id === id)?.amount || 0), 0).toLocaleString()} BIF
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                  <p className="font-medium">Aucune déclaration impayée trouvée</p>
                  <p className="text-sm mt-1">pour le NIF: <span className="font-mono">{nif}</span></p>
                </div>
              )}

              {/* Section Montant manuel */}
              <div className="space-y-2">
                <p className="font-semibold">
                  {factures.length > 0 ? 'Ou montant manuel' : 'Montant à payer'}
                </p>
                <div className="flex items-center border rounded-lg px-4 bg-white">
                  <span className="text-gray-500 mr-2">BIF</span>
                  <input
                    type="text"
                    value={montant}
                    onChange={e => setMontant(e.target.value.replace(/\D/g, ''))}
                    placeholder="Entrez le montant"
                    className="flex-1 py-3 outline-none bg-transparent"
                    disabled={selectedFactures.length > 0}
                  />
                </div>
                {selectedFactures.length > 0 && (
                  <p className="text-sm text-orange-600 bg-orange-50 p-2 rounded-lg">
                    ⓘ Le montant est calculé automatiquement à partir des déclarations sélectionnées
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-2">
              <p className="font-semibold">Résumé du paiement</p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <p><strong>Service :</strong> {service?.name || 'Impôts & Taxes'}</p>
                <p><strong>Type d'impôt :</strong> {impotType}</p>
                <p><strong>NIF :</strong> {nif}</p>
                <p><strong>Contribuable :</strong> {nom}</p>
                {periode && <p><strong>Période :</strong> {periode}</p>}
                {selectedFactures.length > 0 && (
                  <div>
                    <p><strong>Déclarations :</strong> {selectedFactures.length} déclaration(s)</p>
                    <div className="text-sm text-gray-600 mt-1">
                      {selectedFactures.map(id => {
                        const facture = factures.find(f => f.id === id);
                        return facture ? (
                          <div key={id}>• {facture.month}: {facture.amount.toLocaleString()} BIF</div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
                <p className="text-lg font-bold text-green-600 border-t pt-2">
                  Montant total: {
                    (selectedFactures.length > 0 
                      ? selectedFactures.reduce((total, id) => total + (factures.find(f => f.id === id)?.amount || 0), 0)
                      : Number(montant) || 0
                    ).toLocaleString()
                  } BIF
                </p>
              </div>
            </div>
          )}

          {step === 6 && (
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
          disabled={isLoading || !service || (step === 4 && loadingFactures)}
          className={`${step > 1 && step < 7 ? 'w-1/2' : 'w-full'} bg-orange-400 text-white py-2 rounded-full font-semibold hover:bg-orange-500 transition disabled:opacity-50`}
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
};

export default ImpotsForm;