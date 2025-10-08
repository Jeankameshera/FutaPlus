import React from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Données simulées pour le graphique
  const paymentData = [
    { mois: "Janv", paiements: 400 },
    { mois: "Févr", paiements: 700 },
    { mois: "Mars", paiements: 1200 },
    { mois: "Avril", paiements: 900 },
    { mois: "Mai", paiements: 1600 },
    { mois: "Juin", paiements: 2000 },
    { mois: "Juil", paiements: 2400 },
    { mois: "Août", paiements: 1800 },
  ];

  

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 transition-all duration-300">
        
        {/* ====== Stat Cards ====== */}
        <div className="grid grid-cols-1 m:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Paiements effectués", value: "245", path: " " },
            { label: "Services disponibles", value: "7", path: " " },
            { label: "Utilisateurs inscrits", value: "578", path: "" },
            { label: "Paiements en attente", value: "34", path: " " },
          ].map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className="bg-white p-4 sm:p-5 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all text-center sm:text-left cursor-pointer"
            >
              <p className="text-gray-500 text-sm sm:text-base">{item.label}</p>
              <p className="text-2xl sm:text-3xl font-semibold mt-2 text-gray-800">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* ====== Graph + Table ====== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ====== Graphique ====== */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 lg:col-span-2">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
              Évolution des paiements mensuels
            </h2>
            <div className="h-64 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={paymentData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="mois" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="paiements"
                    stroke="#f97316"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#f97316" }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* === Tableau paiements récents === */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 overflow-auto">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
              Derniers paiements
            </h2>
            <table className="w-full text-left border-collapse text-sm sm:text-base">
              <thead>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <th className="py-2 px-2 sm:px-3">Utilisateur</th>
                  <th className="py-2 px-2 sm:px-3">Service</th>
                  <th className="py-2 px-2 sm:px-3">Montant</th>
                  <th className="py-2 px-2 sm:px-3">Date</th>
                  <th className="py-2 px-2 sm:px-3">Statut</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    user: "Jean M.",
                    service: "REGIDESO",
                    montant: "10 000 Fbu",
                    date: "2025-09-25",
                    statut: "Validé",
                    color: "text-green-600",
                  },
                  {
                    user: "Amina K.",
                    service: "Impôts",
                    montant: "25 000 Fbu",
                    date: "2025-09-24",
                    statut: "En attente",
                    color: "text-yellow-600",
                  },
                ].map((p, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="py-2 px-2 sm:px-3">{p.user}</td>
                    <td className="py-2 px-2 sm:px-3">{p.service}</td>
                    <td className="py-2 px-2 sm:px-3">{p.montant}</td>
                    <td className="py-2 px-2 sm:px-3">{p.date}</td>
                    <td className={`py-2 px-2 sm:px-3 font-semibold ${p.color}`}>
                      {p.statut}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ====== Notifications + Raccourcis ====== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
              Notifications récentes
            </h2>

            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                Paiements à valider :{" "}
                <span className="font-semibold text-orange-600">12</span>
              </li>
              <li>
                Nouveaux utilisateurs inscrits :{" "}
                <span className="font-semibold text-green-600">5</span>
              </li>
            </ul>
            
          </div>
          
          
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
