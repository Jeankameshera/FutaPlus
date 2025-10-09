// src/admin/routes/AdminRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Roles from '../pages/Roles';
import Paiements from '../pages/Paiements';
import Services from '../pages/Services';
import Factures from '../pages/Factures';
import Compteurs from '../pages/Compteurs';



export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />    
      <Route path="/roles" element={<Roles />} />  
      <Route path="/paiements" element={<Paiements />} />
      <Route path="/services" element={<Services />} />
      <Route path="/factures" element={<Factures />} />
      <Route path="/compteurs" element={<Compteurs />} />
      
    </Routes>
  );
}
