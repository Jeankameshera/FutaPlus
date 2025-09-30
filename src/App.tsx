import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ServiceDetail from "./pages/ServiceDetail";
import Payment from "./pages/Payment";
import PaymentHistory from "./pages/PaymentHistory";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import AboutPage from "./pages/AboutPage";
import SettingsPage from "./pages/SettingsPage";
import ServicesScreen from "./pages/ServicesScreen";
import RegidesoForm from './services/RegidesoForm';
import CashPowerForm from "./services/CashPowerForm";
import TvForm from "./services/TvForm";
import InternetForm from "./services/InternetForm";
import ImpotForm from "./services/ImpotForm";
import TransportForm from "./services/TransportForm";
import ObrForm from "./services/ObrForm"; //ceci est la page de la vignette auto
const queryClient = new QueryClient();

const PageLoader = () => (
  <motion.div
    className="fixed inset-0 z-[999] flex items-center justify-center bg-white"
    initial={{ opacity: 1 }}
    animate={{ opacity: 0 }}
    transition={{ duration: 0.6 }}
    exit={{ opacity: 0 }}
  >
    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500" />
  </motion.div>
);

const AppRoutes = ({ initialRoute }: { initialRoute: string }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timeout);
  }, [location]);

  return (
    <>
      <AnimatePresence>{loading && <PageLoader />}</AnimatePresence>

      <Routes location={location}>
        <Route path="/" element={<Navigate to={initialRoute} replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />        
        <Route path="/service/:id" element={<ServiceDetail />} />
        <Route path="/payment/:serviceId" element={<Payment />} />
        <Route path="/history" element={<PaymentHistory />} />
        <Route path="/profile" element={<Profile />} />     
        <Route path="/about" element={<AboutPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/internet" element={<InternetForm />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
        <Route path="/servicesscreen" element={<ServicesScreen />} />
        <Route path="/regideso" element={<RegidesoForm />} />
        <Route path="/cashpower" element={<CashPowerForm />} />
        <Route path="/tv" element={<TvForm/>} />
        <Route path="/service-detail/:id" element={<ServiceDetail />} />
        <Route path="/impot" element={<ImpotForm />} />
        <Route path="/transport" element={<TransportForm />} />
        <Route path="/Vignette" element={<ObrForm />} /> 
        


      </Routes>
    </>
  );
};

interface AppProps {
  initialRoute?: string;
}

const App = ({ initialRoute = "/login" }: AppProps) => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes initialRoute={initialRoute} />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
