import React, { useState } from "react";
import { FaEdit, FaTrashAlt, FaPlus, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const serviceStatusColors = {
  true: "bg-green-100 text-green-700",
  false: "bg-red-100 text-red-700",
};

const GestionDesServices = () => {
  const navigate = useNavigate();

  const [services, setServices] = useState([
    { id: 1, name: "REGIDESO",  description: "Paiement eau potable", active: true },
    { id: 2, name: "Vignette Auto", description: "Paiement vignette voiture", active: true },
    { id: 3, name: "Internet",  description: "Paiement Internet", active: true },
  ]);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [newServiceData, setNewServiceData] = useState({ name: "", description: "", active: true });

  const openAddModal = () => {
    setNewServiceData({ name: "", description: "", active: true });
    setEditingService(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setNewServiceData({ ...service });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const saveService = () => {
    if (!newServiceData.name || !newServiceData.price) {
      return alert("Veuillez remplir le nom et le prix du service.");
    }
    if (editingService) {
      // Modification
      setServices(services.map(s => s.id === editingService.id ? { ...newServiceData, price: Number(newServiceData.price) } : s));
    } else {
      // Ajout
      setServices([...services, { ...newServiceData, id: Date.now(), price: Number(newServiceData.price) }]);
    }
    closeModal();
  };

  const deleteService = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const toggleActive = (id) => {
    setServices(services.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
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

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestion des services</h2>

      {/* Recherche */}
      <input
        type="text"
        placeholder="Rechercher par nom ou description..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded-lg mb-4 w-full"
      />

      {/* Tableau des services */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="p-3">Nom</th>            
              <th className="p-3">Description</th>
              <th className="p-3">Statut</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.map(service => (
              <tr key={service.id} className="border-b hover:bg-gray-50 transition-all">
                <td className="p-3">{service.name}</td>
                <td className="p-3">{service.description}</td>
                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${serviceStatusColors[service.active]}`}>
                    {service.active ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="p-3 text-center space-x-2">
                  <button
                    onClick={() => openEditModal(service)}
                    className="px-3 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deleteService(service.id)}
                    className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                  >
                    <FaTrashAlt />
                  </button>
                  <button
                    onClick={() => toggleActive(service.id)}
                    className={`px-3 py-1 rounded-lg ${service.active ? "bg-red-400 hover:bg-red-500" : "bg-green-400 hover:bg-green-500"} text-white`}
                  >
                    {service.active ? "Désactiver" : "Activer"}
                  </button>
                </td>
              </tr>
            ))}
            {filteredServices.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  Aucun service trouvé
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
          <div className="bg-white rounded-2xl p-6 shadow-xl w-11/12 sm:w-96" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              {editingService ? "Modifier le service" : "Ajouter un service"}
            </h3>
            <input
              type="text"
              placeholder="Nom du service"
              value={newServiceData.name}
              onChange={e => setNewServiceData({ ...newServiceData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />            
            <textarea
              placeholder="Description"
              value={newServiceData.description}
              onChange={e => setNewServiceData({ ...newServiceData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <div className="flex justify-end gap-3">
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
