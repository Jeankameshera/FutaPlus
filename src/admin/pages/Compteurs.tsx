import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaPlus, FaArrowLeft, FaSync } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import api from "@/api/api";
import { useToast } from "@/hooks/use-toast";

const statusColors = {
  Actif: "bg-green-100 text-green-700",
  Inactif: "bg-red-100 text-red-700",
  Maintenance: "bg-orange-100 text-orange-700",
};

interface Meter {
  id: number;
  number: string;
  user_id: number;
  first_name: string;
  last_name: string;
  service_name: string;
  service_slug: string;
  status: "Actif" | "Inactif" | "Maintenance";
  created_at: string;
  updated_at: string;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface Service {
  id: number;
  name: string;
  slug: string;
}

const GestionDesCompteurs = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [counters, setCounters] = useState<Meter[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCounter, setEditingCounter] = useState<Meter | null>(null);
  const [newCounterData, setNewCounterData] = useState({ 
    number: "", 
    user_id: "", 
    service_id: "" 
  });
  const [loading, setLoading] = useState(true);

  // Charger les données
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [countersResponse, usersResponse, servicesResponse] = await Promise.all([
        api.get('/meters?service=regideso'),
        api.get('/users'),
        api.get('/services')
      ]);

      setCounters(countersResponse.data);
      setUsers(usersResponse.data);
      setServices(servicesResponse.data);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les données',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Ouvrir modal pour ajouter compteur
  const openAddModal = () => {
    setNewCounterData({ number: "", user_id: "", service_id: "" });
    setEditingCounter(null);
    setIsModalOpen(true);
  };

  // Ouvrir modal pour modifier compteur
  const openEditModal = (counter: Meter) => {
    setEditingCounter(counter);
    setNewCounterData({ 
      number: counter.number, 
      user_id: counter.user_id.toString(),
      service_id: services.find(s => s.slug === counter.service_slug)?.id?.toString() || ""
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCounter(null);
  };

  const saveCounter = async () => {
    if (!newCounterData.number || !newCounterData.user_id || !newCounterData.service_id) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editingCounter) {
        // Modifier compteur
        await api.put(`/meter/${editingCounter.id}`, {
          number: newCounterData.number,
          status: editingCounter.status // Garder le statut actuel
        });
        toast({
          title: 'Succès',
          description: 'Compteur modifié avec succès',
        });
      } else {
        // Ajouter compteur
        await api.post('/meters', {
          number: newCounterData.number,
          user_id: parseInt(newCounterData.user_id),
          service_id: parseInt(newCounterData.service_id)
        });
        toast({
          title: 'Succès',
          description: 'Compteur ajouté avec succès',
        });
      }
      
      closeModal();
      fetchData(); // Recharger les données
    } catch (error: any) {
      console.error('Error saving meter:', error);
      toast({
        title: 'Erreur',
        description: error.response?.data?.error || 'Erreur lors de la sauvegarde',
        variant: 'destructive',
      });
    }
  };

  const deleteCounter = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce compteur ?")) {
      return;
    }

    try {
      await api.delete(`/meter/${id}`);
      toast({
        title: 'Succès',
        description: 'Compteur supprimé avec succès',
      });
      fetchData(); // Recharger les données
    } catch (error: any) {
      console.error('Error deleting meter:', error);
      toast({
        title: 'Erreur',
        description: error.response?.data?.error || 'Erreur lors de la suppression',
        variant: 'destructive',
      });
    }
  };

  const toggleStatus = async (counter: Meter) => {
    const newStatus = counter.status === "Actif" ? "Inactif" : "Actif";
    
    try {
      await api.put(`/meter/${counter.id}`, { status: newStatus });
      toast({
        title: 'Succès',
        description: `Statut changé à ${newStatus}`,
      });
      fetchData(); // Recharger les données
    } catch (error: any) {
      console.error('Error updating meter status:', error);
      toast({
        title: 'Erreur',
        description: error.response?.data?.error || 'Erreur lors du changement de statut',
        variant: 'destructive',
      });
    }
  };

  // Téléchargement PDF
  const downloadPDF = (counter: Meter) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(255, 165, 0);
    doc.setFont("helvetica", "bold");
    doc.text("FuTa+", 105, 25, { align: "center" });
    doc.text("Détails du Compteur", 105, 35, { align: "center" });

    const user = users.find(u => u.id === counter.user_id);
    const userName = user ? `${user.first_name} ${user.last_name}` : 'Utilisateur inconnu';

    autoTable(doc, {
      startY: 40,
      head: [["Détail", "Valeur"]],
      body: [
        ["Numéro", counter.number],
        ["Utilisateur", userName],
        ["Service", counter.service_name],
        ["Statut", counter.status],
        ["Date de création", new Date(counter.created_at).toLocaleDateString('fr-FR')]
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
      `${c.first_name} ${c.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      c.service_name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="text-center">
          <FaSync className="animate-spin text-4xl text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des compteurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 mb-4 text-orange-600 hover:text-orange-800"
      >
        <FaArrowLeft /> Retour
      </button>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestion des compteurs REGIDESO</h2>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all"
        >
          <FaSync /> Actualiser
        </button>
      </div>

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
                <td className="p-3 font-mono">{counter.number}</td>
                <td className="p-3">{counter.first_name} {counter.last_name}</td>
                <td className="p-3">{counter.service_name}</td>
                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[counter.status]}`}>
                    {counter.status}
                  </span>
                </td>
                <td className="p-3 text-center space-x-2 flex flex-wrap justify-center gap-1">
                  <button 
                    onClick={() => openEditModal(counter)} 
                    className="px-3 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    onClick={() => deleteCounter(counter.id)} 
                    className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                  >
                    <FaTrashAlt />
                  </button>
                  <button 
                    onClick={() => toggleStatus(counter)} 
                    className={`px-3 py-1 rounded-lg ${
                      counter.status === "Actif" 
                        ? "bg-red-400 hover:bg-red-500" 
                        : "bg-green-400 hover:bg-green-500"
                    } text-white`}
                  >
                    {counter.status === "Actif" ? "Désactiver" : "Activer"}
                  </button>
                  <button 
                    onClick={() => downloadPDF(counter)} 
                    className="px-3 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Télécharger PDF
                  </button>
                </td>
              </tr>
            ))}
            {filteredCounters.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  {search ? "Aucun compteur trouvé" : "Aucun compteur disponible"}
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
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro du compteur *
              </label>
              <input
                type="text"
                placeholder="Numéro du compteur"
                value={newCounterData.number}
                onChange={e => setNewCounterData({ ...newCounterData, number: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Utilisateur *
              </label>
              <select
                value={newCounterData.user_id}
                onChange={e => setNewCounterData({ ...newCounterData, user_id: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Sélectionner un utilisateur</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service *
              </label>
              <select
                value={newCounterData.service_id}
                onChange={e => setNewCounterData({ ...newCounterData, service_id: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Sélectionner un service</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={closeModal} 
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Annuler
              </button>
              <button 
                onClick={saveCounter} 
                className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white"
              >
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