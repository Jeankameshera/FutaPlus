import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaSync, FaFilePdf, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from "@/api/api";
import { useToast } from "@/hooks/use-toast";

// S'il y a un logo on le convertis en base64 et colle ici
// Exemple : const logo = "data:image/png;base64,...";
const logo = ""; // <-- mettre ton logo base64 

const statusColors = {
  completed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
};

const statusLabels = {
  completed: "Payé",
  failed: "Échoué",
  pending: "En attente"
};

interface Payment {
  id: number;
  amount: number;
  payment_method: string;
  status: 'completed' | 'failed' | 'pending';
  created_at: string;
  service: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  invoice_number: string;
  token?: string;
  plan?: string;
}

const GestionDesFactures = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Charger les paiements
  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      // Pour l'admin, on récupère tous les paiements
      // Note: Vous devrez peut-être créer un endpoint spécifique pour l'admin
      const response = await api.get('/payments');
      setPayments(response.data);
    } catch (error: any) {
      console.error('Error fetching payments:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les paiements',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir changer le statut de ce paiement à "${statusLabels[newStatus as keyof typeof statusLabels]}" ?`)) {
      try {
        await api.put(`/payment/${id}`, { status: newStatus });
        
        toast({
          title: 'Succès',
          description: 'Statut mis à jour avec succès',
        });
        
        fetchPayments(); // Recharger les données
      } catch (error: any) {
        console.error('Error updating payment status:', error);
        toast({
          title: 'Erreur',
          description: error.response?.data?.error || 'Erreur lors de la mise à jour du statut',
          variant: 'destructive',
        });
      }
    }
  };

  const deletePayment = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce paiement ?")) {
      try {
        await api.delete(`/payment/${id}`);
        
        toast({
          title: 'Succès',
          description: 'Paiement supprimé avec succès',
        });
        
        fetchPayments(); // Recharger les données
      } catch (error: any) {
        console.error('Error deleting payment:', error);
        toast({
          title: 'Erreur',
          description: error.response?.data?.error || 'Erreur lors de la suppression',
          variant: 'destructive',
        });
      }
    }
  };

  const downloadPDF = (payment: Payment) => {
    const doc = new jsPDF();

    // Logo
    if (logo) {
      doc.addImage(logo, 'PNG', 15, 10, 40, 40);
    }

    // Titre
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(255, 165, 0); // Orange
    doc.text("FuTa+", 105, 25, { align: "center" });
    doc.setFontSize(16);
    doc.text("REÇU DE PAIEMENT", 105, 35, { align: "center" });

    // Infos utilisateur
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(`Client: ${payment.first_name} ${payment.last_name}`, 20, 60);
    doc.text(`Email: ${payment.email}`, 20, 67);
    doc.text(`Téléphone: ${payment.phone || 'Non renseigné'}`, 20, 74);
    doc.text(`Adresse: ${payment.address || 'Non renseignée'}`, 20, 81);

    // Infos paiement
    const paymentData = [
      ["Service", payment.service],
      ["Méthode de paiement", payment.payment_method],
      ["Montant", payment.amount.toLocaleString() + " FBu"],
      ["Date", new Date(payment.created_at).toLocaleDateString('fr-FR')],
      ["Statut", statusLabels[payment.status]],
      ["Référence", payment.invoice_number],
    ];

    // Ajouter le token si disponible (pour les services prepaid)
    if (payment.token) {
      paymentData.push(["Token", payment.token]);
    }

    // Ajouter le plan si disponible
    if (payment.plan && payment.plan !== 'N/A') {
      paymentData.push(["Forfait", payment.plan]);
    }

    autoTable(doc, {
      startY: 90,
      theme: 'grid',
      head: [["Détails", "Valeur"]],
      body: paymentData,
      headStyles: { fillColor: [255, 165, 0], textColor: 255, fontStyle: 'bold' },
      styles: { cellPadding: 4, fontSize: 10 },
      didParseCell: (data) => {
        if (data.row.index === 4 && data.column.index === 1) {
          // Colorer le statut
          switch(payment.status) {
            case "completed": 
              data.cell.styles.textColor = [0, 128, 0];
              data.cell.styles.fontStyle = 'bold';
              break;
            case "failed": 
              data.cell.styles.textColor = [255, 0, 0];
              data.cell.styles.fontStyle = 'bold';
              break;
            case "pending": 
              data.cell.styles.textColor = [255, 165, 0];
              data.cell.styles.fontStyle = 'bold';
              break;
          }
        }
      }
    });

    // Message bas de page
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text("Merci pour votre confiance ! FuTa+ - Votre partenaire de paiement", 105, doc.lastAutoTable.finalY + 10, { align: "center" });

    // Sauvegarde
    doc.save(`Paiement_${payment.first_name}_${payment.last_name}_${payment.id}.pdf`);
  };

  const filteredPayments = payments.filter(
    payment =>
      `${payment.first_name} ${payment.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      payment.email.toLowerCase().includes(search.toLowerCase()) ||
      payment.service.toLowerCase().includes(search.toLowerCase())
  );

  // Statistiques
  const stats = {
    total: payments.length,
    completed: payments.filter(p => p.status === 'completed').length,
    pending: payments.filter(p => p.status === 'pending').length,
    failed: payments.filter(p => p.status === 'failed').length,
    totalAmount: payments.reduce((sum, p) => sum + p.amount, 0)
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="text-center">
          <FaSync className="animate-spin text-4xl text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des paiements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      {/* Bouton de retour */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-4 text-orange-600 hover:text-orange-800"
      >
        <FaArrowLeft /> Retour
      </button>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestion des paiements</h2>
        <button
          onClick={fetchPayments}
          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all"
        >
          <FaSync /> Actualiser
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total paiements</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">Payés</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">En attente</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          <div className="text-sm text-gray-600">Échoués</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-purple-600">
            {stats.totalAmount.toLocaleString()} FBu
          </div>
          <div className="text-sm text-gray-600">Montant total</div>
        </div>
      </div>

      {/* Recherche */}
      <input
        type="text"
        placeholder="Rechercher par nom, email ou service..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded-lg mb-4 w-full"
      />

      {/* Tableau des paiements */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="p-3">Client</th>
              <th className="p-3">Email</th>
              <th className="p-3">Service</th>
              <th className="p-3">Méthode</th>
              <th className="p-3">Montant</th>
              <th className="p-3">Date</th>
              <th className="p-3">Statut</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map(payment => (
              <tr key={payment.id} className="border-b hover:bg-gray-50 transition-all">
                <td className="p-3">
                  {payment.first_name} {payment.last_name}
                </td>
                <td className="p-3">{payment.email}</td>
                <td className="p-3">{payment.service}</td>
                <td className="p-3">{payment.payment_method}</td>
                <td className="p-3 font-semibold">{payment.amount.toLocaleString()} FBu</td>
                <td className="p-3">
                  {new Date(payment.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    statusColors[payment.status]
                  }`}>
                    {statusLabels[payment.status]}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <div className="flex justify-center flex-wrap gap-2">
                    {payment.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(payment.id, "completed")}
                          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm"
                          title="Marquer comme payé"
                        >
                          <FaCheck /> Valider
                        </button>
                        <button
                          onClick={() => updateStatus(payment.id, "failed")}
                          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm"
                          title="Marquer comme échoué"
                        >
                          <FaTimes /> Échoué
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => downloadPDF(payment)}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm"
                      title="Télécharger PDF"
                    >
                      <FaFilePdf /> PDF
                    </button>
                    <button
                      onClick={() => deletePayment(payment.id)}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm"
                      title="Supprimer"
                    >
                      <FaTrash /> Suppr.
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredPayments.length === 0 && (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-500">
                  {search ? "Aucun paiement trouvé" : "Aucun paiement disponible"}
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