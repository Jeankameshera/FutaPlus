
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, BookOpen, FileText, CreditCard, MessageSquare, User, Menu, X, LogOut, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    toast({
      title: 'Déconnexion réussie',
      description: 'À bientôt !',
    });
    navigate('/login');
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <>
      {/* Header mobile avec bouton menu */}
      <div className="bg-blue-800 text-white p-4 flex justify-between items-center md:hidden">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2 text-white" onClick={handleBack}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-lg font-bold">Futa</h1>
        </div>
        <Button variant="ghost" size="icon" className="text-white" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>
      
      {/* Sidebar sur desktop et menu mobile */}
      <aside className={`${mobileMenuOpen ? 'block fixed inset-0 z-50 bg-blue-800' : 'hidden'} md:block md:w-64 md:static bg-blue-800 text-white md:min-h-screen`}>
        <div className="p-6 hidden md:block">
          <h1 className="text-2xl font-bold">Futa</h1>
        </div>
        <div className="p-4">
          <div className="mb-8">
            <div className="flex items-center mb-6 bg-blue-900 p-4 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center mr-4">
                <span className="text-xl font-bold">JE</span>
              </div>
              <div>
                <p className="font-medium">Jean Étudiant</p>
                <p className="text-sm text-blue-300">ID: 20230042</p>
              </div>
            </div>
          </div>
          
          <nav>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/schedule" 
                  className={`flex items-center p-3 rounded hover:bg-blue-700 transition-colors ${isActiveRoute('/schedule') ? 'bg-blue-700' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Calendar className="mr-3" size={20} />
                  <span>Horaires</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/courses" 
                  className={`flex items-center p-3 rounded hover:bg-blue-700 transition-colors ${isActiveRoute('/courses') ? 'bg-blue-700' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BookOpen className="mr-3" size={20} />
                  <span>Cours</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/grades" 
                  className={`flex items-center p-3 rounded hover:bg-blue-700 transition-colors ${isActiveRoute('/grades') ? 'bg-blue-700' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FileText className="mr-3" size={20} />
                  <span>Notes</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/payments" 
                  className={`flex items-center p-3 rounded hover:bg-blue-700 transition-colors ${isActiveRoute('/payments') ? 'bg-blue-700' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <CreditCard className="mr-3" size={20} />
                  <span>Paiements</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/messages" 
                  className={`flex items-center p-3 rounded hover:bg-blue-700 transition-colors ${isActiveRoute('/messages') ? 'bg-blue-700' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MessageSquare className="mr-3" size={20} />
                  <span>Messages</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  className={`flex items-center p-3 rounded hover:bg-blue-700 transition-colors ${isActiveRoute('/profile') ? 'bg-blue-700' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="mr-3" size={20} />
                  <span>Profil</span>
                </Link>
              </li>
              <li className="mt-8">
                <button 
                  onClick={handleLogout}
                  className="flex items-center p-3 rounded hover:bg-blue-700 transition-colors w-full text-left"
                >
                  <LogOut className="mr-3" size={20} />
                  <span>Déconnexion</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
