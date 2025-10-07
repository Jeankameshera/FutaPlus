import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import api from '@/api/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/reset-password', { email });
      if (response.data.success) {
        toast({
          title: 'Email envoyé',
          description: `Un lien de réinitialisation a été envoyé à ${email}. Vérifiez votre boîte de réception ou vos spams.`,
        });
        navigate('/login');
      } else {
        throw new Error(response.data.error || 'Échec de la demande de réinitialisation');
      }
    } catch (err: any) {
      toast({
        title: 'Erreur',
        description: err.response?.data?.error || 'Échec de la demande de réinitialisation. Veuillez réessayer.',
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
              <Label htmlFor="email" className="text-white">Adresse email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                required
                className="mt-1 bg-white/90 text-black rounded-md"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-300 text-white font-semibold rounded-md"
            >
              {loading ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
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

export default ForgotPassword;