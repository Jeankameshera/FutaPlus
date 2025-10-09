import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const statusColors = {
  "En attente": "bg-orange-100 text-orange-700",
  Validé: "bg-green-100 text-green-700",
  Refusé: "bg-red-100 text-red-700",
};

const ValidationDesPaiements = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [payments, setPayments] = useState([
    { id: 1, user: "Jean K.", email: "jean@gmail.com", service: "REGIDESO", amount: 5000, date: "2025-10-08", status: "En attente" },
    { id: 2, user: "Baraka K..", email: "baraka@gmail.com", service: "Vignette Auto", amount: 10000, date: "2025-10-07", status: "Validé" },
    { id: 3, user: "Heri Jean", email: "heri@gmail.com", service: "Electricité", amount: 8000, date: "2025-10-06", status: "Refusé" },
    { id: 4, user: "Izzy Abab ", email: "izzy@gmail.com", service: "REGIDESO", amount: 6000, date: "2025-10-05", status: "En attente" },
  ]);

  const updateStatus = (id, newStatus) => {
    if (window.confirm(`Êtes-vous sûr de vouloir marquer ce paiement comme "${newStatus}" ?`)) {
      setPayments(
        payments.map(p => p.id === id ? { ...p, status: newStatus } : p)
      );
    }
  };

  const filteredPayments = payments.filter(
    p =>
      p.user.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      {/* Bouton de retour */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-4 text-orange-600 hover:text-orange-800"
      >
        <FaArrowLeft /> Retour
      </button>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Validation des paiements
      </h2>

      {/* Recherche */}
      <input
        type="text"
        placeholder="Rechercher par nom ou email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded-lg mb-4 w-full"
      />

      {/* Tableau des paiements */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="p-3">Utilisateur</th>
              <th className="p-3">Email</th>
              <th className="p-3">Service</th>
              <th className="p-3">Montant</th>
              <th className="p-3">Date</th>
              <th className="p-3">Statut</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map(p => (
              <tr key={p.id} className="border-b hover:bg-gray-50 transition-all">
                <td className="p-3">{p.user}</td>
                <td className="p-3">{p.email}</td>
                <td className="p-3">{p.service}</td>
                <td className="p-3">{p.amount.toLocaleString()} FBu</td>
                <td className="p-3">{p.date}</td>
                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[p.status]}`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-3 text-center space-x-2">
                  {p.status === "En attente" && (
                    <>
                      <button
                        onClick={() => updateStatus(p.id, "Validé")}
                        className="px-3 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-white"
                      >
                        Valider
                      </button>
                      <button
                        onClick={() => updateStatus(p.id, "Refusé")}
                        className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                      >
                        Refuser
                      </button>
                    </>
                  )}
                  {p.status !== "En attente" && (
                    <span className="text-gray-500 italic text-sm">Action non disponible</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredPayments.length === 0 && (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  Aucun paiement trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ValidationDesPaiements;
