import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaPlus, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // pour la navigation

const roleColors = {
  Admin: "bg-red-100 text-red-700",
  Agent: "bg-blue-100 text-blue-700",
  Utilisateur: "bg-green-100 text-green-700",
};

const RoleManagement = () => {
  const navigate = useNavigate();

  const [roles, setRoles] = useState([
    { id: 1, name: "Jean Kameshera", email: "jean@gmail.com", role: "Admin" },
    { id: 2, name: "Alain K.", email: "Alain@gmail.com", role: "Agent" },
    { id: 3, name: "David K.", email: "david@gmail.com", role: "Utilisateur" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [isAddMode, setIsAddMode] = useState(false);
  const [search, setSearch] = useState("");
  const [newUserData, setNewUserData] = useState({ name: "", email: "", role: "Utilisateur" });

  // Ouvrir modal pour édition
  const openModal = (user) => {
    setEditingUser(user);
    setNewRole(user.role);
    setIsAddMode(false);
    setIsModalOpen(true);
  };

  // Ouvrir modal pour ajout
  const openAddModal = () => {
    setNewUserData({ name: "", email: "", role: "Utilisateur" });
    setIsAddMode(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingUser(null);
    setNewRole("");
    setIsModalOpen(false);
  };

  // Fermer modal avec "Esc"
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && closeModal();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const updateRole = () => {
    if (!newRole) return alert("Veuillez choisir un rôle.");
    setRoles(
      roles.map((r) =>
        r.id === editingUser.id ? { ...r, role: newRole } : r
      )
    );
    closeModal();
  };

  const addUser = () => {
    if (!newUserData.name || !newUserData.email) {
      return alert("Veuillez remplir tous les champs.");
    }
    if (roles.find(r => r.email === newUserData.email)) {
      return alert("Cet email existe déjà !");
    }
    setRoles([
      ...roles,
      { id: Date.now(), ...newUserData }
    ]);
    closeModal();
  };

  const deleteUser = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      setRoles(roles.filter((r) => r.id !== id));
    }
  };

  const filteredRoles = roles.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 bg-orange-100 min-h-screen">
      {/* Bouton de retour */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-4 text-orange-600 hover:text-orange-800"
      >
        <FaArrowLeft /> Retour
      </button>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Gestion des rôles
      </h2>

      {/* Recherche */}
      <input
        type="text"
        placeholder="Rechercher par nom ou email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded-lg mb-4 w-full"
      />

      {/* Tableau des rôles */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="p-3">Nom</th>
              <th className="p-3">Email</th>
              <th className="p-3">Rôle</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-gray-50 transition-all"
              >
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${roleColors[user.role]}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="p-3 text-center space-x-3">
                  <button
                    onClick={() => openModal(user)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
            {filteredRoles.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  Aucun utilisateur trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bouton d’ajout */}
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
            className="bg-white rounded-2xl p-6 shadow-xl w-11/12 sm:w-96"
            onClick={(e) => e.stopPropagation()}
          >
            {isAddMode ? (
              <>
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                  Ajouter un utilisateur
                </h3>
                <input
                  type="text"
                  placeholder="Nom"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <select
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                >
                  <option value="Admin">Admin</option>
                  <option value="Agent">Agent</option>
                  <option value="Utilisateur">Utilisateur</option>
                </select>
                <div className="flex justify-end gap-3">
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
                  {editingUser?.name} — <span className="text-sm">{editingUser?.email}</span>
                </p>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <option value="Admin">Admin</option>
                  <option value="Agent">Agent</option>
                  <option value="Utilisateur">Utilisateur</option>
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
                    disabled={newRole === editingUser.role}
                    className={`px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white ${newRole === editingUser.role ? "opacity-50 cursor-not-allowed" : ""}`}
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
