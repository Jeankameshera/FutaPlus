import React, { useState } from "react";
import BottomNav from "@/components/BottomNav";

const TVPayment = () => {
  const [step, setStep] = useState(1);
  const [provider, setProvider] = useState("");
  const [subscriberNumber, setSubscriberNumber] = useState("");
  const [bouquet, setBouquet] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [price, setPrice] = useState(0);
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");

  const bouquets = {
    "Canal+": [
      { name: "Access", price: 40000 },
      { name: "Evasion", price: 60000 },
      { name: "Evasion+", price: 80000 },
      { name: "Access+",price: 30000 },
      { name: "Tout Canal", price: 50000 },
    ],
    "Startimes" : [
      { name: "Basic", price: 7000 },
      { name: "Smart", price: 15000 },
      { name: "Super", price: 30000 },
    ],
  };

  const handleBouquetChange = (value) => {
    setBouquet(value);
    const selected = bouquets[provider].find((b) => b.name === value);
    if (selected) setPrice(selected.price);
  };

  const handleFinalConfirm = () => {
    if (!phone || !pin) {
      alert("Veuillez entrer le numéro de téléphone et le code PIN.");
      return;
    }

    alert(`Paiement validé avec succès !
    Fournisseur: ${provider}
    Abonné: ${subscriberNumber}
    Bouquet: ${bouquet}
    Prix: ${price} Fbu
    Paiement via: ${paymentMethod}
    Téléphone: ${phone}`);

    // Reset
    setStep(1);
    setProvider("");
    setSubscriberNumber("");
    setBouquet("");
    setPaymentMethod("");
    setPrice(0);
    setPhone("");
    setPin("");
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-4 text-center">Paiement TV </h2>

      {/* Étape 1 */}
      {step === 1 && (
        <div>
          <h3 className="font-semibold mb-2">Choisissez le fournisseur</h3>
          <select
            className="w-full p-2 border rounded mb-4"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          >
            <option value="">-- Sélectionner --</option>
            <option value="Canal+">Canal+</option>
            <option value="Startimes">Startimes</option>
          </select>
          <button
            disabled={!provider}
            onClick={() => setStep(2)}
            className="w-full bg-orange-500 text-white p-2 rounded disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}

      {/* Étape 2 */}
      {step === 2 && (
        <div>
          <h3 className="font-semibold mb-2">Numéro d’abonné</h3>
          <input
            type="text"
            placeholder="Entrez votre numéro d’abonnement"
            className="w-full p-2 border rounded mb-4"
            value={subscriberNumber}
            onChange={(e) => setSubscriberNumber(e.target.value)}
          />
          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Retour
            </button>
            <button
              disabled={!subscriberNumber}
              onClick={() => setStep(3)}
              className="bg-orange-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {/* Étape 3 */}
      {step === 3 && (
        <div>
          <h3 className="font-semibold mb-2">Choisissez le bouquet</h3>
          <select
            className="w-full p-2 border rounded mb-4"
            value={bouquet}
            onChange={(e) => handleBouquetChange(e.target.value)}
          >
            <option value="">-- Sélectionner --</option>
            {bouquets[provider]?.map((b) => (
              <option key={b.name} value={b.name}>
                {b.name} ({b.price} Fbu)
              </option>
            ))}
          </select>
          <div className="flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Retour
            </button>
            <button
              disabled={!bouquet}
              onClick={() => setStep(4)}
              className="bg-orange-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {/* Étape 4 */}
      {step === 4 && (
        <div>
          <h3 className="font-semibold mb-2">Mode de paiement</h3>
          <p className="mb-2">
            Bouquet <strong>{bouquet}</strong> :{" "}
            <span className="text-green-600 font-bold">{price} Fbu</span>
          </p>
          <select
            className="w-full p-2 border rounded mb-4"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">-- Sélectionner --</option>
            <option value="Lumitel">Lumicash</option>
            <option value="Econet">Econet</option>
            
          </select>
          <div className="flex justify-between">
            <button
              onClick={() => setStep(3)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Retour
            </button>
            <button
              disabled={!paymentMethod}
              onClick={() => setStep(5)}
              className="bg-orange-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {/* Étape 5 */}
      {step === 5 && (
        <div>
          <h3 className="font-semibold mb-4">Confirmation</h3>
          <p><strong>Fournisseur:</strong> {provider}</p>
          <p><strong>Abonné:</strong> {subscriberNumber}</p>
          <p><strong>Bouquet:</strong> {bouquet}</p>
          <p><strong>Montant:</strong> {price} Fbu</p>
          <p><strong>Paiement via:</strong> {paymentMethod}</p>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => setStep(4)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Retour
            </button>
            <button
              onClick={() => setStep(6)}
              className="bg-orange-500 text-white px-4 py-2 rounded"
            >
              Valider
            </button>
          </div>
        </div>
      )}

      {/* Étape 6 */}
      {step === 6 && (
        <div>
          <h3 className="font-semibold mb-4">Validation du paiement</h3>
          <input
            type="tel"
            placeholder="Numéro de téléphone"
            className="w-full p-2 border rounded mb-3"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="password"
            placeholder="Code PIN"
            className="w-full p-2 border rounded mb-4"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
          <div className="flex justify-between">
            <button
              onClick={() => setStep(5)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Retour
            </button>
            <button
              onClick={handleFinalConfirm}
              className="bg-orange-500 text-white px-4 py-2 rounded"
            >
              Confirmer le paiement
            </button>
          </div>
        </div>
        
      )}
      <BottomNav />
    </div>    
  );
};


export default TVPayment;