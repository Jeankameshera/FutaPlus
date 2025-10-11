import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaPlus, FaArrowLeft, FaSync, FaBan, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "@/api/api";
import { useToast } from "@/hooks/use-toast";

const roleColors = {
  admin: "bg-red-100 text-red-700",
  agent: "bg-blue-100 text-blue-700",
  client: "bg-green-100 text-green-700",
};

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_blocked: boolean;
  phone?: string;
  address?: string;
  created_at: string;
}

const RoleManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState("");
  const [isAddMode, setIsAddMode] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [newUserData, setNewUserData] = useState({ 
    first_name: "", 
    last_name: "", 
    email: "", 
    password: "", 
    phone: "",
    address: "",
    role: "client" 
  });

  // Charger les utilisateurs
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les utilisateurs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Ouvrir modal pour édition
  const openModal = (user: User) => {
    setEditingUser(user);
    setNewRole(user.role);
    setIsAddMode(false);
    setIsModalOpen(true);
  };

  // Ouvrir modal pour ajout
  const openAddModal = () => {
    setNewUserData({ 
      first_name: "", 
      last_name: "", 
      email: "", 
      password: "", 
      phone: "",
      address: "",
      role: "user" 
    });
    setIsAddMode(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingUser(null);
    setNewRole("");
    setIsModalOpen(false);
  };

  // Mettre à jour le rôle
  const updateRole = async () => {
    if (!newRole || !editingUser) return;

    try {
      await api.put('/change-role', {
        id: editingUser.id,
        role: newRole
      });

      toast({
        title: 'Succès',
        description: 'Rôle mis à jour avec succès',
      });

      fetchUsers(); // Recharger les données
      closeModal();
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast({
        title: 'Erreur',
        description: error.response?.data?.error || 'Erreur lors de la mise à jour du rôle',
        variant: 'destructive',
      });
    }
  };

  // Ajouter un utilisateur
  const addUser = async () => {
    if (!newUserData.first_name || !newUserData.last_name || !newUserData.email || !newUserData.password) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires',
        variant: 'destructive',
      });
      return;
    }

    try {
      await api.post('/register', {
        first_name: newUserData.first_name,
        last_name: newUserData.last_name,
        email: newUserData.email,
        password: newUserData.password,
        phone: newUserData.phone,
        address: newUserData.address,
        role: newUserData.role
      });

      toast({
        title: 'Succès',
        description: 'Utilisateur créé avec succès',
      });

      fetchUsers(); // Recharger les données
      closeModal();
    } catch (error: any) {
      console.error('Error adding user:', error);
      toast({
        title: 'Erreur',
        description: error.response?.data?.error || 'Erreur lors de la création de l\'utilisateur',
        variant: 'destructive',
      });
    }
  };

  // Supprimer un utilisateur
  const deleteUser = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      return;
    }

    try {
      await api.delete(`/user/${id}`);
      toast({
        title: 'Succès',
        description: 'Utilisateur supprimé avec succès',
      });
      fetchUsers(); // Recharger les données
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Erreur',
        description: error.response?.data?.error || 'Erreur lors de la suppression',
        variant: 'destructive',
      });
    }
  };

  // Bloquer/Débloquer un utilisateur
  const toggleBlockUser = async (user: User) => {
    try {
      await api.post('/toggle-block', {
        id: user.id,
        is_blocked: !user.is_blocked
      });

      toast({
        title: 'Succès',
        description: `Utilisateur ${!user.is_blocked ? 'bloqué' : 'débloqué'} avec succès`,
      });

      fetchUsers(); // Recharger les données
    } catch (error: any) {
      console.error('Error toggling user block:', error);
      toast({
        title: 'Erreur',
        description: error.response?.data?.error || 'Erreur lors du changement de statut',
        variant: 'destructive',
      });
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="text-center">
          <FaSync className="animate-spin text-4xl text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des utilisateurs...</p>
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
        <h2 className="text-2xl font-bold text-gray-800">
          Gestion des utilisateurs et rôles
        </h2>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all"
        >
          <FaSync /> Actualiser
        </button>
      </div>

      {/* Recherche */}
      <input
        type="text"
        placeholder="Rechercher par nom, email ou rôle..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded-lg mb-4 w-full"
      />

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-blue-600">{users.length}</div>
          <div className="text-sm text-gray-600">Total utilisateurs</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-red-600">
            {users.filter(u => u.role === 'admin').length}
          </div>
          <div className="text-sm text-gray-600">Administrateurs</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-orange-600">
            {users.filter(u => u.role === 'agent').length}
          </div>
          <div className="text-sm text-gray-600">Agents</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-green-600">
            {users.filter(u => u.role === 'client').length}
          </div>
          <div className="text-sm text-gray-600">Clients</div>
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="p-3">Nom</th>
              <th className="p-3">Email</th>
              <th className="p-3">Téléphone</th>
              <th className="p-3">Rôle</th>
              <th className="p-3">Statut</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className={`border-b hover:bg-gray-50 transition-all ${
                  user.is_blocked ? 'bg-red-50' : ''
                }`}
              >
                <td className="p-3">
                  {user.first_name} {user.last_name}
                  {user.is_blocked && (
                    <span className="ml-2 text-xs text-red-500 font-semibold">(BLOQUÉ)</span>
                  )}
                </td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.phone || 'Non défini'}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      roleColors[user.role] || roleColors.client
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      user.is_blocked
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {user.is_blocked ? 'Bloqué' : 'Actif'}
                  </span>
                </td>
                <td className="p-3 text-center space-x-2 flex justify-center">
                  <button
                    onClick={() => openModal(user)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all"
                    title="Modifier le rôle"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => toggleBlockUser(user)}
                    className={`p-2 rounded-lg transition-all ${
                      user.is_blocked
                        ? 'text-green-600 hover:text-green-800 hover:bg-green-50'
                        : 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50'
                    }`}
                    title={user.is_blocked ? 'Débloquer' : 'Bloquer'}
                  >
                    {user.is_blocked ? <FaCheck /> : <FaBan />}
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all"
                    title="Supprimer"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  {search ? "Aucun utilisateur trouvé" : "Aucun utilisateur disponible"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bouton d'ajout */}
      <div className="mt-6 flex justify-end">
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all"
          onClick={openAddModal}
        >
          <FaPlus /> Ajouter un utilisateur
        </button>
      </div>

      {/* Modal d'édition / ajout */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl p-6 shadow-xl w-11/12 sm:w-96 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {isAddMode ? (
              <>
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                  Ajouter un utilisateur
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Prénom *"
                    value={newUserData.first_name}
                    onChange={(e) => setNewUserData({ ...newUserData, first_name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="text"
                    placeholder="Nom *"
                    value={newUserData.last_name}
                    onChange={(e) => setNewUserData({ ...newUserData, last_name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="password"
                    placeholder="Mot de passe *"
                    value={newUserData.password}
                    onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="text"
                    placeholder="Téléphone"
                    value={newUserData.phone}
                    onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="text"
                    placeholder="Adresse"
                    value={newUserData.address}
                    onChange={(e) => setNewUserData({ ...newUserData, address: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <select
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={newUserData.role}
                    onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                  >
                    <option value="client">Client</option>
                    <option value="agent">Agent</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={addUser}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Ajouter
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                  Modifier le rôle
                </h3>
                <p className="mb-3 text-gray-600">
                  {editingUser?.first_name} {editingUser?.last_name}
                </p>
                <p className="mb-3 text-sm text-gray-500">
                  {editingUser?.email}
                </p>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <option value="client">Client</option>
                  <option value="agent">Agent</option>
                  <option value="admin">Administrateur</option>
                </select>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={updateRole}
                    disabled={newRole === editingUser?.role}
                    className={`px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white ${
                      newRole === editingUser?.role ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Enregistrer
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;