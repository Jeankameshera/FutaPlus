import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaPlus, FaArrowLeft, FaSync, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "@/api/api";
import { useToast } from "@/hooks/use-toast";

const serviceStatusColors = {
  true: "bg-green-100 text-green-700",
  false: "bg-red-100 text-red-700",
};

interface Service {
  id: number;
  name: string;
  description: string;
  category: string | null;
  image: string | null;
  slug: string;
  type: 'prepaid' | 'postpaid';
  plans: { name: string; price: number }[] | null;
  is_active?: boolean;
}

const GestionDesServices = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newServiceData, setNewServiceData] = useState({ 
    name: "", 
    description: "", 
    category: "",
    slug: "",
    type: "postpaid" as 'prepaid' | 'postpaid',
    plans: [] as { name: string; price: number }[]
  });
  const [loading, setLoading] = useState(true);
  const [planName, setPlanName] = useState("");
  const [planPrice, setPlanPrice] = useState("");

  // Charger les services
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/services');
      setServices(response.data);
    } catch (error: any) {
      console.error('Error fetching services:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les services',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setNewServiceData({ 
      name: "", 
      description: "", 
      category: "",
      slug: "",
      type: "postpaid",
      plans: []
    });
    setEditingService(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setNewServiceData({ 
      name: service.name,
      description: service.description,
      category: service.category || "",
      slug: service.slug,
      type: service.type,
      plans: service.plans || []
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    setPlanName("");
    setPlanPrice("");
  };

  const addPlan = () => {
    if (!planName || !planPrice) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir le nom et le prix du plan',
        variant: 'destructive',
      });
      return;
    }

    const newPlan = {
      name: planName,
      price: parseFloat(planPrice)
    };

    setNewServiceData({
      ...newServiceData,
      plans: [...newServiceData.plans, newPlan]
    });

    setPlanName("");
    setPlanPrice("");
  };

  const removePlan = (index: number) => {
    const updatedPlans = [...newServiceData.plans];
    updatedPlans.splice(index, 1);
    setNewServiceData({
      ...newServiceData,
      plans: updatedPlans
    });
  };

  const saveService = async () => {
    if (!newServiceData.name || !newServiceData.description) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir le nom et la description du service',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editingService) {
        // Modification
        await api.put(`/service/${editingService.id}`, newServiceData);
        toast({
          title: 'Succès',
          description: 'Service modifié avec succès',
        });
      } else {
        // Ajout
        await api.post('/services', newServiceData);
        toast({
          title: 'Succès',
          description: 'Service ajouté avec succès',
        });
      }
      
      closeModal();
      fetchServices(); // Recharger les données
    } catch (error: any) {
      console.error('Error saving service:', error);
      toast({
        title: 'Erreur',
        description: error.response?.data?.error || 'Erreur lors de la sauvegarde',
        variant: 'destructive',
      });
    }
  };

  const deleteService = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      return;
    }

    try {
      await api.delete(`/service/${id}`);
      toast({
        title: 'Succès',
        description: 'Service supprimé avec succès',
      });
      fetchServices(); // Recharger les données
    } catch (error: any) {
      console.error('Error deleting service:', error);
      toast({
        title: 'Erreur',
        description: error.response?.data?.error || 'Erreur lors de la suppression',
        variant: 'destructive',
      });
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(search.toLowerCase()) ||
    service.description.toLowerCase().includes(search.toLowerCase()) ||
    (service.category && service.category.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="text-center">
          <FaSync className="animate-spin text-4xl text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des services...</p>
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
        <h2 className="text-2xl font-bold text-gray-800">Gestion des services</h2>
        <button
          onClick={fetchServices}
          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all"
        >
          <FaSync /> Actualiser
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-blue-600">{services.length}</div>
          <div className="text-sm text-gray-600">Total services</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-green-600">
            {services.filter(s => s.type === 'postpaid').length}
          </div>
          <div className="text-sm text-gray-600">Services postpaid</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-orange-600">
            {services.filter(s => s.type === 'prepaid').length}
          </div>
          <div className="text-sm text-gray-600">Services prepaid</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-purple-600">
            {services.filter(s => s.plans && s.plans.length > 0).length}
          </div>
          <div className="text-sm text-gray-600">Avec forfaits</div>
        </div>
      </div>

      {/* Recherche */}
      <input
        type="text"
        placeholder="Rechercher par nom, description ou catégorie..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded-lg mb-4 w-full"
      />

      {/* Tableau des services */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="p-3">Nom</th>
              <th className="p-3">Description</th>
              <th className="p-3">Type</th>
              <th className="p-3">Catégorie</th>
              <th className="p-3">Forfaits</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.map(service => (
              <tr key={service.id} className="border-b hover:bg-gray-50 transition-all">
                <td className="p-3">
                  <div className="font-semibold">{service.name}</div>
                  <div className="text-xs text-gray-500">{service.slug}</div>
                </td>
                <td className="p-3">{service.description}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    service.type === 'prepaid' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {service.type === 'prepaid' ? 'Prepaid' : 'Postpaid'}
                  </span>
                </td>
                <td className="p-3">
                  {service.category || <span className="text-gray-400">Non définie</span>}
                </td>
                <td className="p-3">
                  {service.plans && service.plans.length > 0 ? (
                    <div className="text-sm">
                      {service.plans.length} forfait(s)
                      <div className="text-xs text-gray-500 mt-1">
                        {service.plans.slice(0, 2).map(plan => plan.name).join(', ')}
                        {service.plans.length > 2 && '...'}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">Aucun</span>
                  )}
                </td>
                <td className="p-3">
                  <div className="flex justify-center flex-wrap gap-2">
                    <button
                      onClick={() => openEditModal(service)}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm"
                      title="Modifier"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteService(service.id)}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm"
                      title="Supprimer"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredServices.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  {search ? "Aucun service trouvé" : "Aucun service disponible"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bouton ajouter service */}
      <div className="mt-6 flex justify-end">
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all"
          onClick={openAddModal}
        >
          <FaPlus /> Ajouter un service
        </button>
      </div>

      {/* Modal d'ajout / édition */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50" onClick={closeModal}>
          <div className="bg-white rounded-2xl p-6 shadow-xl w-11/12 sm:w-96 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              {editingService ? "Modifier le service" : "Ajouter un service"}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du service *</label>
                <input
                  type="text"
                  placeholder="Nom du service"
                  value={newServiceData.name}
                  onChange={e => {
                    setNewServiceData({ 
                      ...newServiceData, 
                      name: e.target.value,
                      slug: generateSlug(e.target.value)
                    });
                  }}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  placeholder="slug-du-service"
                  value={newServiceData.slug}
                  onChange={e => setNewServiceData({ ...newServiceData, slug: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  placeholder="Description du service"
                  value={newServiceData.description}
                  onChange={e => setNewServiceData({ ...newServiceData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <input
                  type="text"
                  placeholder="Catégorie"
                  value={newServiceData.category}
                  onChange={e => setNewServiceData({ ...newServiceData, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de service</label>
                <select
                  value={newServiceData.type}
                  onChange={e => setNewServiceData({ ...newServiceData, type: e.target.value as 'prepaid' | 'postpaid' })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="postpaid">Postpaid (avec factures)</option>
                  <option value="prepaid">Prepaid (recharges)</option>
                </select>
              </div>

              {/* Gestion des forfaits (pour les services prepaid) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Forfaits</label>
                <div className="space-y-2 mb-3">
                  {newServiceData.plans.map((plan, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">
                        {plan.name} - {plan.price} FBu
                      </span>
                      <button
                        type="button"
                        onClick={() => removePlan(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Nom du forfait"
                    value={planName}
                    onChange={e => setPlanName(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg p-2 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Prix"
                    value={planPrice}
                    onChange={e => setPlanPrice(e.target.value)}
                    className="w-24 border border-gray-300 rounded-lg p-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={addPlan}
                    className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Annuler
              </button>
              <button
                onClick={saveService}
                className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white"
              >
                {editingService ? "Enregistrer" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionDesServices;