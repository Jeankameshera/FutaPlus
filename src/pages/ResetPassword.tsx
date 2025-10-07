import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import api from '@/api/api';
import { Link } from 'lucide-react';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      toast({
        title: 'Erreur',
        description: 'Token de réinitialisation manquant.',
        variant: 'destructive',
      });
      navigate('/login');
    }
  }, [searchParams, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Erreur',
        description: 'Les mots de passe ne correspondent pas.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/complete-reset-password', {
        token,
        new_password: newPassword,
      });
      if (response.data.success) {
        toast({
          title: 'Succès',
          description: 'Mot de passe réinitialisé avec succès. Connectez-vous avec votre nouveau mot de passe.',
        });
        navigate('/login');
      } else {
        throw new Error(response.data.error || 'Échec de la réinitialisation');
      }
    } catch (err: any) {
      toast({
        title: 'Erreur',
        description: err.response?.data?.error || 'Échec de la réinitialisation. Veuillez réessayer.',
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
            <p className="text-sm text-white/80 mt-2">Réinitialiser votre mot de passe</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="newPassword" className="text-white">Nouveau mot de passe</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-1 bg-white/90 text-black rounded-md"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-white">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <p>
              Retour à la{' '}
              <Link to="/login" className="underline text-orange-400 font-medium">
                connexion
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;