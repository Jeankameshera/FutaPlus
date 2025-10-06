import React, { useState } from "react";
import BottomNav from '@/components/BottomNav';

const InternetPayment = () => {
  const [step, setStep] = useState(1);
  const [provider, setProvider] = useState("");
  const [accountId, setAccountId] = useState("");
  const [plan, setPlan] = useState("");
  const [price, setPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");

  const plans = {
    "CBINET": [
      { name: "5 Go", price: 10000 },
      { name: "10 Go", price: 18000 },
      { name: "Illimité", price: 30000 },
    ],
    "Onatel": [
      { name: "2 Go", price: 5000 },
      { name: "5 Go", price: 12000 },
      { name: "10 Go", price: 20000 },
    ],
    "Lumitel": [
      { name: "1 Go", price: 3000 },
      { name: "3 Go", price: 8000 },
      { name: "5 Go", price: 13000 },
    ],
    "Swiftsat": [
      { name: "10 Go", price: 25000 },
      { name: "20 Go", price: 40000 },
      { name: "50 Go", price: 80000 },
    ],
    "Starlink": [
      { name: "50 Mbps illimité", price: 60000 },
      { name: "100 Mbps illimité", price: 100000 },
    ],
  };

  const handlePlanChange = (value) => {
    setPlan(value);
    const sel = plans[provider]?.find(p => p.name === value);
    if (sel) setPrice(sel.price);
  };

  const handleFinalConfirm = () => {
    if (!phone || !pin) {
      alert("Veuillez entrer le numéro de téléphone et le PIN");
      return;
    }
    alert(`
Paiement validé 
Fournisseur : ${provider}
Compte : ${accountId}
Plan : ${plan}
Prix : ${price} Fbu
Mode de paiement : ${paymentMethod}
Téléphone : ${phone}
    `);
    // Reset
    setStep(1);
    setProvider("");
    setAccountId("");
    setPlan("");
    setPrice(0);
    setPaymentMethod("");
    setPhone("");
    setPin("");

  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-4 text-center">Paiement Internet</h2>

      {step === 1 && (
        <div>
          <h3 className="font-semibold mb-2">Choisissez le fournisseur</h3>
          <select
            className="w-full p-2 border rounded mb-4"
            value={provider}
            onChange={e => setProvider(e.target.value)}
          >
            <option value="">-- Sélectionner --</option>
            <option value="BBS">BBS</option>
            <option value="CBINET">CBINET</option>
            <option value="Onatel">Onatel</option>            
            <option value="Swiftsat">Swiftsat</option>
            <option value="Starlink">Starlink</option>
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

      {step === 2 && (
        <div>
          <h3 className="font-semibold mb-2">Identifiant / compte</h3>
          <input
            type="text"
            placeholder="Votre identifiant / compte ISP"
            className="w-full p-2 border rounded mb-4"
            value={accountId}
            onChange={e => setAccountId(e.target.value)}
          />
          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="bg-gray-400 text-white px-4 py-2 rounded">Retour</button>
            <button
              disabled={!accountId}
              onClick={() => setStep(3)}
              className="bg-orange-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className="font-semibold mb-2">Choisissez le plan / forfait</h3>
          <select
            className="w-full p-2 border rounded mb-4"
            value={plan}
            onChange={e => handlePlanChange(e.target.value)}
          >
            <option value="">-- Sélectionner --</option>
            {plans[provider]?.map(p => (
              <option key={p.name} value={p.name}>
                {p.name} — {p.price} Fbu
              </option>
            ))}
          </select>
          <div className="flex justify-between">
            <button onClick={() => setStep(2)} className="bg-gray-400 text-white px-4 py-2 rounded">Retour</button>
            <button
              disabled={!plan}
              onClick={() => setStep(4)}
              className="bg-orange-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h3 className="font-semibold mb-2">Mode de paiement</h3>
          <p className="mb-2">
            Plan <strong>{plan}</strong> : <span className="text-green-600 font-bold">{price} Fbu</span>
          </p>
          <select
            className="w-full p-2 border rounded mb-4"
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value)}
          >
            <option value="">-- Sélectionner --</option>
            <option value="Mobile Money">Mobile Money</option>
            <option value="Carte bancaire">Carte bancaire</option>
          </select>
          <div className="flex justify-between">
            <button onClick={() => setStep(3)} className="bg-gray-400 text-white px-4 py-2 rounded">Retour</button>
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

      {step === 5 && (
        <div>
          <h3 className="font-semibold mb-4">5. Confirmation</h3>
          <p><strong>Fournisseur :</strong> {provider}</p>
          <p><strong>Compte :</strong> {accountId}</p>
          <p><strong>Plan :</strong> {plan}</p>
          <p><strong>Montant :</strong> {price} Fbu</p>
          <p><strong>Paiement via :</strong> {paymentMethod}</p>

          <div className="flex justify-between mt-4">
            <button onClick={() => setStep(4)} className="bg-gray-400 text-white px-4 py-2 rounded">Retour</button>
            <button onClick={() => setStep(6)} className="bg-orange-500 text-white px-4 py-2 rounded">Valider</button>
          </div>
        </div>
      )}

      {step === 6 && (
        <div>
          <h3 className="font-semibold mb-4">Validation finale</h3>
          <input
            type="tel"
            placeholder="Numéro de téléphone"
            className="w-full p-2 border rounded mb-3"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
          <input
            type="password"
            placeholder="Code PIN"
            className="w-full p-2 border rounded mb-4"
            value={pin}
            onChange={e => setPin(e.target.value)}
          />
          <div className="flex justify-between">
            <button onClick={() => setStep(5)} className="bg-gray-400 text-white px-4 py-2 rounded">Retour</button>
            <button onClick={handleFinalConfirm} className="bg-green-600 text-white px-4 py-2 rounded">Confirmer le paiement</button>
          </div>
        </div>
        
      )}
      <BottomNav />
    </div>
  );
};

export default InternetPayment;
