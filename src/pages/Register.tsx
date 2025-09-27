import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

import { Phone, Mail, Facebook } from 'lucide-react';

const Register = () => {
  
  const [Name, setName] = useState('');
  const [Nickname, setNickname] = useState('');
  
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: 'Erreur',
        description: 'Les mots de passe ne correspondent pas.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', emailOrPhone);

      toast({
        title: 'Inscription réussie',
        description: 'Bienvenue sur votre application de paiement',
      });

      setLoading(false);
      navigate('/Dashboard');
    }, 1000);
  };

  const handleSocialSignup = (provider: string) => {
    toast({
      title: 'Inscription via ' + provider,
      description: 'Fonctionnalité en cours de développement',
    });
  };

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0A2647] to-[#113b68] p-8">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-orange-500">FuTa+</h1>
            <p className="text-sm text-gray-500 mt-2">Créer un compte gratuit</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="Name">Nom</Label>
              <Input
                id="Name"
                type="text"
                value={Name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 border-gray-300 focus:ring-orange-500 focus:border-orange-500" />
            </div>



            <div>
              <Label htmlFor="Nickname">Prénom</Label>
              <Input
                id="Nickname"
                type="text"
                value={Nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                className="mt-1 border-gray-300 focus:ring-orange-500 focus:border-orange-500" />
            </div>




             {/* === Header sticky réutilisé du Dashboard === */}

             

            <div>
              <Label htmlFor="emailOrPhone">Email / Téléphone</Label>
              <Input
                id="emailOrPhone"
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                required
                className="mt-1 border-gray-300 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 border-gray-300 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmez le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 border-gray-300 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-orange-500 hover:bg-orange-600"
            >
              {loading ? 'Inscription...' : 'Créer un compte'}
            </Button>
          </form>
          

          {/* Footer */}
          <div className="text-center text-sm text-gray-600 mt-6">
            Vous avez déjà un compte ?{' '}
            <Link to="/login" className="text-orange-500 hover:underline">
              Se connecter
            </Link>
          </div>          
        </div>
      </div>
    </div>
  );
};

export default Register;
