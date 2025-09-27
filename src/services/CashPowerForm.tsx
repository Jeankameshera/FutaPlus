import React, { useState } from 'react';

const CashPowerForm: React.FC = () => {
  // États pour gérer chaque donnée du formulaire
  const [step, setStep] = useState(1);
  const [meterNumber, setMeterNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);

  // Étape suivante avec animation de chargement si on passe à l'étape 2
  const handleNext = () => {
    if (step === 1) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(2);
      }, 1500); // Simule un chargement de 1.5 sec
    } else if (step === 2) {
      setStep(3);
    }
  };

  // Finaliser la simulation du paiement
  const handleConfirm = () => {
    console.log("Paiement confirmé :", {
      meterNumber,
      amount,
      phone,
      paymentMethod,
    });
    alert("Paiement en cours...");
    // Tu peux envoyer ces infos vers une API 
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">

        {/* ÉTAPE 1 - Saisie des infos */}
      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Paiement Cash Power</h2>

          <div>
            <label className="block text-sm font-medium 
            ">Numéro du compteur</label>
            <input
              type="text"
              value={meterNumber}
              onChange={(e) => setMeterNumber(e.target.value)}
              required
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Montant (BIF)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Numéro de téléphone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="+257 61 23 45 67"
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-orange-600 text-white 
            px-4 py-2 rounded hover:bg-orange-700"
          >
            Suivant
          </button>
        </form>
      )}

      {/* ÉTAPE 2 - Vérification avec chargement */}
      {step === 2 && (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-10">Chargement...</div>
          ) : (
            <>
              <h2 className="text-xl font-bold">Vérification</h2>
              <p><strong>Compteur :</strong> {meterNumber}</p>
              <p><strong>Montant :</strong> {amount} BIF</p>
              <p><strong>Téléphone :</strong> {phone}</p>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => setStep(1)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Retour
                </button>
                <button
                  onClick={handleNext}
                  className="bg-orange-600 text-white px-4 py-2 rounded"
                >
                  Continuer
                </button>
              </div>
            </>
          )}
        </div>
      )}





 {      /* ÉTAPE 3 - Choix du mode de paiement */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Mode de paiement</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Sélectionner un moyen :</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
              className="w-full border px-4 py-2 rounded"
            >
              <option value="">-- Choisir --</option>
              <option value="Ecocash">Ecocash</option>
              <option value="Lumicash">Lumicash</option>
              <option value="Smart Pay">Smart Pay</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep(2)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Retour
            </button>
            <button
              onClick={handleConfirm}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Confirmer le paiement
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashPowerForm;
