import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaSync, FaFilePdf, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from "@/api/api";
import { useToast } from "@/hooks/use-toast";

const logo = ""; // <-- mettre ton logo base64 

const statusColors = {
  unpaid: "bg-red-100 text-red-700",
  paid: "bg-green-100 text-green-700",
};

const statusLabels = {
  unpaid: "Non payé",
  paid: "Payé"
};

interface Invoice {
  id: number;
  month: string;
  amount: number;
  status: 'paid' | 'unpaid';
  meter_number: string;
  payment_id: number | null;
  service: string;
  service_slug: string;
  first_name: string;
  last_name: string;
  created_at: string;
}


const GestionDesFactures = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState("all");

  // Charger les factures
  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      
      // CORRECTION: Essayer d'abord l'endpoint admin
      try {
        const response = await api.get('/invoices/admin');
        // CORRECTION: Vérifier que la réponse contient bien un tableau
        if (Array.isArray(response.data)) {
          setInvoices(response.data);
        } else if (response.data && Array.isArray(response.data.invoices)) {
          // Si les données sont dans un objet avec une propriété invoices
          setInvoices(response.data.invoices);
        } else {
          console.warn('Response data is not an array:', response.data);
          setInvoices([]);
        }
      } catch (adminError) {
        console.log('Admin endpoint not available, trying fallback...');
        // Fallback: essayer de récupérer via users
        await fetchInvoicesFallback();
      }
      
    } catch (error: any) {
      console.error('Error fetching invoices:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les factures',
        variant: 'destructive',
      });
      // CORRECTION: S'assurer que invoices reste un tableau même en cas d'erreur
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  // CORRECTION: Méthode fallback séparée
  const fetchInvoicesFallback = async () => {
    try {
      const usersResponse = await api.get('/users');
      const allInvoices = [];
      
      // Récupérer les factures pour chaque utilisateur
      for (const user of usersResponse.data) {
        try {
          const userInvoices = await api.get(`/invoices/user?userId=${user.id}`);
          // CORRECTION: Vérifier que c'est bien un tableau
          if (Array.isArray(userInvoices.data)) {
            allInvoices.push(...userInvoices.data);
          }
        } catch (userError) {
          console.error(`Error fetching invoices for user ${user.id}:`, userError);
        }
      }
      
      setInvoices(allInvoices);
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
      throw fallbackError;
    }
  };

  // CORRECTION: Fonction pour s'assurer que invoices est toujours un tableau
  const getSafeInvoices = () => {
    return Array.isArray(invoices) ? invoices : [];
  };

  const updateStatus = async (id: number, newStatus: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir changer le statut de cette facture à "${statusLabels[newStatus as keyof typeof statusLabels]}" ?`)) {
      try {
        const safeInvoices = getSafeInvoices();
        
        // Pour les factures, on peut marquer comme payé en créant un paiement
        if (newStatus === 'paid') {
          const invoice = safeInvoices.find(inv => inv.id === id);
          if (invoice) {
            // Créer un paiement pour cette facture
            await api.post('/payment', {
              service_id: await getServiceIdBySlug(invoice.service_slug),
              invoice_numbers: [id],
              payment_method: 'Admin',
              phone_number: 'N/A',
              pin: '0000'
            });
          }
        }
        
        toast({
          title: 'Succès',
          description: 'Statut mis à jour avec succès',
        });
        
        fetchInvoices(); // Recharger les données
      } catch (error: any) {
        console.error('Error updating invoice status:', error);
        toast({
          title: 'Erreur',
          description: error.response?.data?.error || 'Erreur lors de la mise à jour du statut',
          variant: 'destructive',
        });
      }
    }
  };

  const getServiceIdBySlug = async (slug: string): Promise<number> => {
    try {
      const servicesResponse = await api.get('/services');
      const service = servicesResponse.data.find((s: any) => s.slug === slug);
      return service ? service.id : 1;
    } catch (error) {
      return 1;
    }
  };

  const deleteInvoice = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette facture ?")) {
      try {
        await api.delete(`/invoice/${id}`);
        
        toast({
          title: 'Succès',
          description: 'Facture supprimée avec succès',
        });
        
        fetchInvoices();
      } catch (error: any) {
        console.error('Error deleting invoice:', error);
        toast({
          title: 'Erreur',
          description: error.response?.data?.error || 'Erreur lors de la suppression',
          variant: 'destructive',
        });
      }
    }
  };

  const downloadPDF = async (invoice: Invoice) => {
    try {
      const response = await api.get(`/invoice/${invoice.id}/pdf`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Facture_${invoice.first_name}_${invoice.last_name}_${invoice.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error: any) {
      console.error('Error downloading PDF:', error);
      generateClientPDF(invoice);
    }
  };

  const generateClientPDF = (invoice: Invoice) => {
    const doc = new jsPDF();

    if (logo) {
      doc.addImage(logo, 'PNG', 15, 10, 40, 40);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(255, 165, 0);
    doc.text("FuTa+", 105, 25, { align: "center" });
    doc.setFontSize(16);
    doc.text("FACTURE", 105, 35, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(`Client: ${invoice.first_name} ${invoice.last_name}`, 20, 60);
    doc.text(`Mois: ${invoice.month}`, 20, 67);
    doc.text(`Compteur: ${invoice.meter_number || 'N/A'}`, 20, 74);

    const invoiceData = [
      ["Service", invoice.service],
      ["Montant", invoice.amount.toLocaleString() + " FBu"],
      ["Date de création", new Date(invoice.created_at).toLocaleDateString('fr-FR')],
      ["Statut", statusLabels[invoice.status]],
      ["Référence", `FAC-${invoice.id}`],
    ];

    autoTable(doc, {
      startY: 90,
      theme: 'grid',
      head: [["Détails", "Valeur"]],
      body: invoiceData,
      headStyles: { fillColor: [255, 165, 0], textColor: 255, fontStyle: 'bold' },
      styles: { cellPadding: 4, fontSize: 10 },
      didParseCell: (data) => {
        if (data.row.index === 3 && data.column.index === 1) {
          switch(invoice.status) {
            case "paid": 
              data.cell.styles.textColor = [0, 128, 0];
              data.cell.styles.fontStyle = 'bold';
              break;
            case "unpaid": 
              data.cell.styles.textColor = [255, 0, 0];
              data.cell.styles.fontStyle = 'bold';
              break;
          }
        }
      }
    });

    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text("Merci pour votre confiance ! FuTa+ - Votre partenaire de paiement", 105, doc.lastAutoTable.finalY + 10, { align: "center" });

    doc.save(`Facture_${invoice.first_name}_${invoice.last_name}_${invoice.id}.pdf`);
  };

  // CORRECTION: Utiliser getSafeInvoices() partout
  const safeInvoices = getSafeInvoices();
  
  const filteredInvoices = safeInvoices.filter(
    invoice =>
      `${invoice.first_name} ${invoice.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      invoice.service.toLowerCase().includes(search.toLowerCase()) ||
      (invoice.meter_number && invoice.meter_number.toLowerCase().includes(search.toLowerCase()))
  ).filter(
    invoice => selectedService === "all" || invoice.service_slug === selectedService
  );

  // CORRECTION: Statistiques basées sur safeInvoices
  const stats = {
    total: safeInvoices.length,
    paid: safeInvoices.filter(inv => inv.status === 'paid').length,
    unpaid: safeInvoices.filter(inv => inv.status === 'unpaid').length,
    totalAmount: safeInvoices.reduce((sum, inv) => sum + inv.amount, 0),
    unpaidAmount: safeInvoices.filter(inv => inv.status === 'unpaid').reduce((sum, inv) => sum + inv.amount, 0)
  };

  // CORRECTION: Services uniques basés sur safeInvoices
  const uniqueServices = [...new Set(safeInvoices.map(inv => inv.service_slug))];

  // CORRECTION: Fonction pour formater les montants
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="text-center">
          <FaSync className="animate-spin text-4xl text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des factures...</p>
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
        <h2 className="text-2xl font-bold text-gray-800">Gestion des factures</h2>
        <button
          onClick={fetchInvoices}
          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all"
        >
          <FaSync /> Actualiser
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total factures</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
          <div className="text-sm text-gray-600">Payées</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-red-600">{stats.unpaid}</div>
          <div className="text-sm text-gray-600">Impayées</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-purple-600">
            {formatAmount(stats.totalAmount)} FBu
          </div>
          <div className="text-sm text-gray-600">Montant total</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-orange-600">
            {formatAmount(stats.unpaidAmount)} FBu
          </div>
          <div className="text-sm text-gray-600">À recouvrer</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Rechercher par client, service ou numéro de compteur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-lg flex-1"
        />
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="border p-2 rounded-lg w-full sm:w-48"
        >
          <option value="all">Tous les services</option>
          {uniqueServices.map(serviceSlug => {
            const service = safeInvoices.find(inv => inv.service_slug === serviceSlug);
            return (
              <option key={serviceSlug} value={serviceSlug}>
                {service?.service || serviceSlug}
              </option>
            );
          })}
        </select>
      </div>

      {/* Tableau des factures */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="p-3">Client</th>
              <th className="p-3">Service</th>
              <th className="p-3">Compteur</th>
              <th className="p-3">Mois</th>
              <th className="p-3 text-right">Montant</th>
              <th className="p-3">Date</th>
              <th className="p-3">Statut</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map(invoice => (
              <tr key={invoice.id} className="border-b hover:bg-gray-50 transition-all">
                <td className="p-3">
                  {invoice.first_name} {invoice.last_name}
                </td>
                <td className="p-3">{invoice.service}</td>
                <td className="p-3 font-mono text-sm">{invoice.meter_number || 'N/A'}</td>
                <td className="p-3">{invoice.month}</td>
                <td className="p-3 text-right font-semibold">
                  {formatAmount(invoice.amount)} FBu
                </td>
                <td className="p-3 text-sm">
                  {new Date(invoice.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    statusColors[invoice.status]
                  }`}>
                    {statusLabels[invoice.status]}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex justify-center flex-wrap gap-2">
                    {invoice.status === "unpaid" && (
                      <button
                        onClick={() => updateStatus(invoice.id, "paid")}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs"
                        title="Marquer comme payée"
                      >
                        <FaCheck /> Payer
                      </button>
                    )}
                    <button
                      onClick={() => downloadPDF(invoice)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs"
                      title="Télécharger PDF"
                    >
                      <FaFilePdf /> PDF
                    </button>
                    <button
                      onClick={() => deleteInvoice(invoice.id)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs"
                      title="Supprimer"
                    >
                      <FaTrash /> Suppr.
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-500">
                  {search || selectedService !== "all" ? "Aucune facture trouvée" : "Aucune facture disponible"}
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