import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';



// S'il y a un logo on le convertis en base64 et colle ici
// Exemple : const logo = "data:image/png;base64,...";
const logo = ""; // <-- mettre ton logo base64 

const statusColors = {
  "Non payé": "bg-red-100 text-red-700",
  Payé: "bg-green-100 text-green-700",
  Annulé: "bg-gray-100 text-gray-700",
};

const GestionDesFactures = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [invoices, setInvoices] = useState([
    { id: 1, user: "Jean kameshera", email: "jean@gmail.com", service: "REGIDESO", amount: 5000, date: "2025-10-08", status: "Payé" },
    { id: 2, user: "Baraka karhagomba", email: "baraka@gmail.com", service: "Vignette Auto", amount: 10000, date: "2025-10-07", status: "Payé" },
    { id: 3, user: "Heri jean", email: "heri@gmail.com", service: "Internet", amount: 8000, date: "2025-10-06", status: "Annulé" },
  ]);

  const updateStatus = (id, newStatus) => {
    if (window.confirm(`Êtes-vous sûr de vouloir changer le statut de cette facture à "${newStatus}" ?`)) {
      setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv));
    }
  };

  const deleteInvoice = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette facture ?")) {
      setInvoices(invoices.filter(inv => inv.id !== id));
    }
  };

  const downloadPDF = (invoice) => {
    const doc = new jsPDF();

    // Logo
    if (logo) {
      doc.addImage(logo, 'PNG', 15, 10, 40, 40);
    }

    // Titre
    doc.setFont("helvetica", "bold");
    doc.setFontSize(40);
    doc.setTextColor(255, 165, 0); // Orange
    doc.text("FuTa+", 105, 25, { align: "center" });

    // Infos utilisateur
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(`Utilisateur: ${invoice.user}`, 20, 60);
    doc.text(`Email: ${invoice.email}`, 20, 68);

    // Infos facture
    const invoiceData = [
      ["Service", invoice.service],
      ["Montant", invoice.amount.toLocaleString() + " FBu"],
      ["Date", invoice.date],
      ["Statut", invoice.status],
    ];

    autoTable(doc, {
      startY: 80,
      theme: 'grid',
      head: [["Détails", "Valeur"]],
      body: invoiceData,
      headStyles: { fillColor: [255, 165, 0], textColor: 255, fontStyle: 'bold' },
      styles: { cellPadding: 4, fontSize: 12 },
    });

    // Message bas de page
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Merci pour votre confiance !", 105, doc.lastAutoTable.finalY + 10, { align: "center" });

    // Sauvegarde
    doc.save(`Facture_${invoice.user}_${invoice.id}.pdf`);
  };

  const filteredInvoices = invoices.filter(
    inv =>
      inv.user.toLowerCase().includes(search.toLowerCase()) ||
      inv.email.toLowerCase().includes(search.toLowerCase())
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

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestion des factures</h2>

      {/* Recherche */}
      <input
        type="text"
        placeholder="Rechercher par nom ou email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded-lg mb-4 w-full"
      />

      {/* Tableau des factures */}
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
            {filteredInvoices.map(inv => (
              <tr key={inv.id} className="border-b hover:bg-gray-50 transition-all">
                <td className="p-3">{inv.user}</td>
                <td className="p-3">{inv.email}</td>
                <td className="p-3">{inv.service}</td>
                <td className="p-3">{inv.amount.toLocaleString()} FBu</td>
                <td className="p-3">{inv.date}</td>
                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[inv.status]}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <div className="flex justify-center flex-wrap gap-2">
                    {inv.status === "Non payé" && (
                      <>
                        <button
                          onClick={() => updateStatus(inv.id, "Payé")}
                          className="px-3 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-white"
                        >
                          Valider
                        </button>
                        <button
                          onClick={() => updateStatus(inv.id, "Annulé")}
                          className="px-3 py-1 rounded-lg bg-gray-500 hover:bg-gray-600 text-white"
                        >
                          Annuler
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => downloadPDF(inv)}
                      className="px-3 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Télécharger PDF
                    </button>
                    <button
                      onClick={() => deleteInvoice(inv.id)}
                      className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  Aucune facture trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionDesFactures;
