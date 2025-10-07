import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import api from '@/api/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Login with email and password
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/login', { email, password });
      console.log('Login response:', response.data);
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userRole', user.role || 'client');
        console.log('Token stored:', token);
        
        toast({
          title: 'Connexion réussie',
          description: 'Bienvenue sur votre application de paiement',
        });
        navigate('/dashboard');
      } else {
        throw new Error(response.data.error || 'Login failed');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      toast({
        title: 'Erreur de connexion',
        description: err.response?.data?.error || 'Identifiants incorrects. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0A2647] to-[#154b86] p-8">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-lg text-white">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold">FuTa+</h1>
            <p className="text-sm text-white/80 mt-2">Payez vos factures facilement</p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-white">Email / Téléphone</Label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                required
                className="mt-1 bg-white/90 text-black rounded-md"
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-white">Mot de passe</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-orange-400 hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-1 bg-white/90 text-black rounded-md"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-300 text-white font-semibold rounded-md"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          {/* Link to registration */}
          <div className="mt-6 text-center text-sm">
            <p>
              Pas encore de compte ?{' '}
              <Link to="/register" className="underline text-orange-400 font-medium">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;