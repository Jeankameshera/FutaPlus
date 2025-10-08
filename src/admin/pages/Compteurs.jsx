import React, { useState } from "react";
import { FaEdit, FaTrashAlt, FaPlus, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const statusColors = {
  Actif: "bg-green-100 text-green-700",
  Inactif: "bg-red-100 text-red-700",
  Maintenance: "bg-orange-100 text-orange-700",
};

const GestionDesCompteurs = () => {
  const navigate = useNavigate();

  const [counters, setCounters] = useState([
    { id: 1, number: "123456", user: "Jean kameshera", service: "REGIDESO", status: "Actif" },
    { id: 2, number: "654321", user: "karhagomba Alain", service: "REGIDESO", status: "Inactif" },
    { id: 3, number: "987654", user: "David ", service: "REGIDESO", status: "Maintenance" },
  ]);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCounter, setEditingCounter] = useState(null);
  const [newCounterData, setNewCounterData] = useState({ number: "", user: "", service: "REGIDESO", status: "Actif" });

  // Ouvrir modal pour ajouter compteur
  const openAddModal = () => {
    setNewCounterData({ number: "", user: "", service: "REGIDESO", status: "Actif" });
    setEditingCounter(null);
    setIsModalOpen(true);
  };

  // Ouvrir modal pour modifier compteur
  const openEditModal = (counter) => {
    setEditingCounter(counter);
    setNewCounterData({ ...counter });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCounter(null);
  };

  const saveCounter = () => {
    if (!newCounterData.number || !newCounterData.user) {
      return alert("Veuillez remplir le numéro et le nom de l'utilisateur.");
    }
    if (editingCounter) {
      // Modifier compteur
      setCounters(counters.map(c => c.id === editingCounter.id ? newCounterData : c));
    } else {
      // Ajouter compteur
      setCounters([...counters, { ...newCounterData, id: Date.now() }]);
    }
    closeModal();
  };

  const deleteCounter = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce compteur ?")) {
      setCounters(counters.filter(c => c.id !== id));
    }
  };

  const toggleStatus = (id) => {
    setCounters(counters.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === "Actif" ? "Inactif" : "Actif";
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  // Téléchargement PDF
  const downloadPDF = (counter) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(255, 165, 0);
    doc.setFont("helvetica", "bold");
    doc.text("FuTa+", 105, 25, { align: "center" });
    doc.text("Détails du Compteur", 105, 35, { align: "center" });

    autoTable(doc, {
      startY: 40,
      head: [["Détail", "Valeur"]],
      body: [
        ["Numéro", counter.number],
        ["Utilisateur", counter.user],
        ["Service", counter.service],
        ["Statut", counter.status]
      ],
      headStyles: { fillColor: [255, 165, 0], textColor: 255, fontStyle: "bold" },
      bodyStyles: { cellPadding: 5, fontSize: 12 },
      didParseCell: (data) => {
        if (data.row.index === 3 && data.column.index === 1) {
          switch(counter.status) {
            case "Actif": data.cell.styles.textColor = [0,128,0]; break;
            case "Inactif": data.cell.styles.textColor = [255,0,0]; break;
            case "Maintenance": data.cell.styles.textColor = [255,165,0]; break;
          }
          data.cell.styles.fontStyle = "bold";
        }
      }
    });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Merci pour votre confiance !", 105, doc.lastAutoTable.finalY + 10, { align: "center" });

    doc.save(`Compteur_${counter.number}.pdf`);
  };

  const filteredCounters = counters.filter(
    c =>
      c.number.includes(search) ||
      c.user.toLowerCase().includes(search.toLowerCase()) ||
      c.service.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-4
       text-gray-700 hover:text-gray-900">
        <FaArrowLeft /> Retour
      </button>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestion des compteurs REGIDESO</h2>

      <input
        type="text"
        placeholder="Rechercher par numéro ou utilisateur..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border p-2 rounded-lg mb-4 w-full"
      />

      <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="p-3">Numéro</th>
              <th className="p-3">Utilisateur</th>
              <th className="p-3">Service</th>
              <th className="p-3">Statut</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCounters.map(counter => (
              <tr key={counter.id} className="border-b hover:bg-gray-50 transition-all">
                <td className="p-3">{counter.number}</td>
                <td className="p-3">{counter.user}</td>
                <td className="p-3">{counter.service}</td>
                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[counter.status]}`}>
                    {counter.status}
                  </span>
                </td>
                <td className="p-3 text-center space-x-2 flex flex-wrap justify-center gap-1">
                  <button onClick={() => openEditModal(counter)} className="px-3 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white">
                    <FaEdit />
                  </button>
                  <button onClick={() => deleteCounter(counter.id)} className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white">
                    <FaTrashAlt />
                  </button>
                  <button onClick={() => toggleStatus(counter.id)} className={`px-3 py-1 rounded-lg ${counter.status === "Actif" ? "bg-red-400 hover:bg-red-500" : "bg-green-400 hover:bg-green-500"} text-white`}>
                    {counter.status === "Actif" ? "Désactiver" : "Activer"}
                  </button>
                  <button onClick={() => downloadPDF(counter)} className="px-3 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white">
                    Telecharger PDF
                  </button>
                </td>
              </tr>
            ))}
            {filteredCounters.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  Aucun compteur trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all"
          onClick={openAddModal}
        >
          <FaPlus /> Ajouter un compteur
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50" onClick={closeModal}>
          <div className="bg-white rounded-2xl p-6 shadow-xl w-11/12 sm:w-96" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              {editingCounter ? "Modifier le compteur" : "Ajouter un compteur"}
            </h3>
            <input
              type="text"
              placeholder="Numéro du compteur"
              value={newCounterData.number}
              onChange={e => setNewCounterData({ ...newCounterData, number: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="text"
              placeholder="Utilisateur"
              value={newCounterData.user}
              onChange={e => setNewCounterData({ ...newCounterData, user: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <select
              value={newCounterData.status}
              onChange={e => setNewCounterData({ ...newCounterData, status: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
              <option value="Maintenance">Maintenance</option>
            </select>
            <div className="flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800">
                Annuler
              </button>
              <button onClick={saveCounter} className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white">
                {editingCounter ? "Enregistrer" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionDesCompteurs;
