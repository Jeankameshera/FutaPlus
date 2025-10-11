import React, { useState, useEffect } from "react";
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
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { FaSync, FaUsers, FaCreditCard, FaShoppingCart, FaClock } from "react-icons/fa";
import api from "@/api/api";
import { useToast } from "@/hooks/use-toast";

// Couleurs pour les graphiques
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// ================== Interfaces ==================
interface DashboardStats {
  totalPayments: number;
  totalUsers: number;
  totalServices: number;
  pendingPayments: number;
  totalRevenue: number;
  activeServices: number;
}

interface Payment {
  id: number;
  first_name: string;
  last_name: string;
  service: string;
  amount: number;
  created_at: string;
  status: 'completed' | 'pending' | 'failed';
  payment_method: string;
}

interface MonthlyData {
  month: string;
  payments: number;
  revenue: number;
  users: number;
}

interface ServiceStats {
  service: string;
  count: number;
  revenue: number;
  percentage: number;
}

interface Service {
  id: number;
  name: string;
  description: string;
  plans: any[] | null;
  is_active: boolean;
}

// ================== Composants ==================
const StatCard = ({ label, value, icon: Icon, color, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white p-4 sm:p-5 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer group"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm sm:text-base">{label}</p>
        <p className="text-2xl sm:text-3xl font-semibold mt-2 text-gray-800">
          {value}
        </p>
      </div>
      <div className={`p-3 rounded-full ${color} group-hover:scale-110 transition-transform`}>
        <Icon className="text-white text-xl" />
      </div>
    </div>
  </div>
);

const PaymentChart = ({ data }) => (
  <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
    <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
      Évolution des paiements mensuels
    </h2>
    <div className="h-[320px] sm:h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
            formatter={(value) => [`${value} paiements`, 'Paiements']}
          />
          <Line
            type="monotone"
            dataKey="payments"
            stroke="#f97316"
            strokeWidth={3}
            dot={{ r: 5, fill: "#f97316" }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const RevenueChart = ({ data }) => (
  <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
    <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
      Revenus mensuels
    </h2>
    <div className="h-[320px] sm:h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
            formatter={(value) => [`${value.toLocaleString()} FBu`, 'Revenus']}
          />
          <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const ServicesPieChart = ({ data }) => (
  <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
    <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
      Répartition par service
    </h2>
    <div className="h-[320px] sm:h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ service, percentage }) => `${service} (${percentage}%)`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value} paiements`, name]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const RecentPaymentsTable = ({ data }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Validé';
      case 'pending': return 'En attente';
      case 'failed': return 'Échoué';
      default: return status;
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FBu';
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 overflow-auto">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
        Derniers paiements
      </h2>
      <table className="w-full text-left border-collapse text-sm sm:text-base min-w-[600px]">
        <thead>
          <tr className="border-b border-gray-300 bg-gray-50">
            {["Utilisateur", "Service", "Montant", "Date", "Statut", "Méthode"].map((h) => (
              <th key={h} className="py-2 px-2 sm:px-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((payment) => (
            <tr
              key={payment.id}
              className="border-b border-gray-200 hover:bg-gray-50 transition"
            >
              <td className="py-2 px-2 sm:px-3">
                {payment.first_name} {payment.last_name}
              </td>
              <td className="py-2 px-2 sm:px-3">{payment.service}</td>
              <td className="py-2 px-2 sm:px-3 font-semibold">
                {formatAmount(payment.amount)}
              </td>
              <td className="py-2 px-2 sm:px-3">
                {new Date(payment.created_at).toLocaleDateString('fr-FR')}
              </td>
              <td className={`py-2 px-2 sm:px-3 font-semibold ${getStatusColor(payment.status)}`}>
                {getStatusLabel(payment.status)}
              </td>
              <td className="py-2 px-2 sm:px-3 text-sm">
                {payment.payment_method}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucun paiement récent
        </div>
      )}
    </div>
  );
};

// ================== Page principale ==================
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [stats, setStats] = useState<DashboardStats>({
    totalPayments: 0,
    totalUsers: 0,
    totalServices: 0,
    pendingPayments: 0,
    totalRevenue: 0,
    activeServices: 0
  });
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [serviceStats, setServiceStats] = useState<ServiceStats[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les données du dashboard
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les paiements pour les statistiques
      const paymentsResponse = await api.get('/payments');
      const payments = paymentsResponse.data;
      
      // Récupérer les utilisateurs
      const usersResponse = await api.get('/users');
      const users = usersResponse.data;
      
      // Récupérer les services
      const servicesResponse = await api.get('/services');
      const servicesData = servicesResponse.data;
      setServices(servicesData);

      // Calculer les statistiques
      const totalPayments = payments.length;
      const totalUsers = users.length;
      const totalServices = servicesData.length;
      const pendingPayments = payments.filter(p => p.status === 'pending').length;
      const totalRevenue = payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + parseFloat(p.amount), 0);
      const activeServices = servicesData.filter(s => s.is_active).length;

      setStats({
        totalPayments,
        totalUsers,
        totalServices,
        pendingPayments,
        totalRevenue,
        activeServices
      });

      // Données récentes (5 derniers paiements)
      const recent = payments
        .slice(0, 5)
        .map(p => ({
          ...p,
          first_name: p.first_name || 'Utilisateur',
          last_name: p.last_name || ''
        }));
      setRecentPayments(recent);

      // Générer des données mensuelles simulées (à remplacer par des vraies données)
      const monthly = generateMonthlyData(payments);
      setMonthlyData(monthly);

      // Statistiques par service
      const serviceStatsData = calculateServiceStats(payments);
      setServiceStats(serviceStatsData);

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les données du dashboard',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Générer des données mensuelles (simulées pour l'instant)
  const generateMonthlyData = (payments: Payment[]): MonthlyData[] => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const currentMonth = new Date().getMonth();
    
    return months.slice(0, currentMonth + 1).map((month, index) => {
      const monthPayments = payments.filter(p => {
        const paymentDate = new Date(p.created_at);
        return paymentDate.getMonth() === index;
      });
      
      return {
        month,
        payments: monthPayments.length,
        revenue: monthPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0),
        users: Math.floor(Math.random() * 50) + 10 // Simulé pour l'instant
      };
    });
  };

  // Calculer les statistiques par service
  const calculateServiceStats = (payments: Payment[]): ServiceStats[] => {
    const serviceMap = new Map();
    
    payments.forEach(payment => {
      if (payment.status === 'completed') {
        const existing = serviceMap.get(payment.service) || { count: 0, revenue: 0 };
        serviceMap.set(payment.service, {
          count: existing.count + 1,
          revenue: existing.revenue + parseFloat(payment.amount)
        });
      }
    });

    const total = Array.from(serviceMap.values()).reduce((sum, s) => sum + s.count, 0);
    
    return Array.from(serviceMap.entries()).map(([service, data]) => ({
      service,
      count: data.count,
      revenue: data.revenue,
      percentage: total > 0 ? Math.round((data.count / total) * 100) : 0
    }));
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  // CORRECTION: Calcul du nombre de services avec forfaits
  const servicesWithPlans = services.filter(s => s.plans && s.plans.length > 0).length;

  const statCards = [
    {
      label: "Paiements effectués",
      value: formatNumber(stats.totalPayments),
      icon: FaCreditCard,
      color: "bg-blue-500",
      path: "/admin/paiements"
    },
    {
      label: "Utilisateurs inscrits",
      value: formatNumber(stats.totalUsers),
      icon: FaUsers,
      color: "bg-green-500",
      path: "/admin/roles"
    },
    {
      label: "Services disponibles",
      value: formatNumber(stats.totalServices),
      icon: FaShoppingCart,
      color: "bg-purple-500",
      path: "/admin/services"
    },
    {
      label: "Paiements en attente",
      value: formatNumber(stats.pendingPayments),
      icon: FaClock,
      color: "bg-orange-500",
      path: "/admin/factures"
    }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 flex justify-center items-center">
          <div className="text-center">
            <FaSync className="animate-spin text-4xl text-orange-500 mx-auto mb-4" />
            <p className="text-gray-600">Chargement du dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 transition-all duration-300">
        {/* En-tête avec bouton actualiser */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Tableau de Bord Admin</h1>
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all"
          >
            <FaSync /> Actualiser
          </button>
        </div>

        {/* === Cartes de statistiques === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((item, i) => (
            <StatCard
              key={i}
              label={item.label}
              value={item.value}
              icon={item.icon}
              color={item.color}
              onClick={() => navigate(item.path)}
            />
          ))}
        </div>

        {/* === Cartes de revenus et services actifs === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-4 sm:p-5 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm sm:text-base">Revenus totaux</p>
                <p className="text-2xl sm:text-3xl font-semibold mt-2 text-green-600">
                  {formatNumber(stats.totalRevenue)} FBu
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-500">
                <FaCreditCard className="text-white text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm sm:text-base">Services actifs</p>
                <p className="text-2xl sm:text-3xl font-semibold mt-2 text-purple-600">
                  {stats.activeServices}/{stats.totalServices}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-500">
                <FaShoppingCart className="text-white text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* === Graphiques === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <PaymentChart data={monthlyData} />
          </div>
          <ServicesPieChart data={serviceStats} />
        </div>

        {/* === Revenus et derniers paiements === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RevenueChart data={monthlyData} />
          <RecentPaymentsTable data={recentPayments} />
        </div>

        {/* === Notifications === */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
            Aperçu du système
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Statistiques rapides</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex justify-between">
                  <span>Taux de réussite des paiements:</span>
                  <span className="font-semibold">
                    {stats.totalPayments > 0 
                      ? Math.round(((stats.totalPayments - stats.pendingPayments) / stats.totalPayments) * 100)
                      : 0
                    }%
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Revenu moyen par transaction:</span>
                  <span className="font-semibold">
                    {stats.totalPayments > 0 
                      ? formatNumber(Math.round(stats.totalRevenue / stats.totalPayments)) 
                      : 0
                    } FBu
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Services avec forfaits:</span>
                  <span className="font-semibold">
                    {servicesWithPlans}
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Actions rapides</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/admin/paiements')}
                  className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  📊 Voir tous les paiements
                </button>
                <button
                  onClick={() => navigate('/admin/services')}
                  className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  ⚙️ Gérer les services
                </button>
                <button
                  onClick={() => navigate('/admin/factures')}
                  className="w-full text-left p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                >
                  📋 Valider les paiements en attente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;