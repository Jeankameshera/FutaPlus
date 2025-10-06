import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import api from '@/api/api';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation côté client
    if (password !== confirmPassword) {
      toast({
        title: 'Erreur',
        description: 'Les mots de passe ne correspondent pas.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    // Valider email ou téléphone
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!emailRegex.test(email) && !phoneRegex.test(phone)) {
      toast({
        title: 'Erreur',
        description: 'Veuillez entrer un email ou un numéro de téléphone valide.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    // Préparer les données pour l'API
    const data = {
      first_name: firstName,
      last_name: lastName,
      address: address,
      email: email,
      phone: phone,
      password,
    };

    try {
      const response = await api.post('/register', data);
      console.log('Register response:', response.data);
      if (response.data.success) {
        toast({
          title: 'Inscription réussie',
          description: 'Votre compte a été créé avec succès. Veuillez maintenant vous connecter.',
        });
        navigate('/login');
      }else {
        throw new Error(response.data.error || 'Inscription échouée');
      }
    } catch (err: any) {
      console.error('Register error:', err);
      toast({
        title: 'Erreur',
        description: err.response?.data?.error || 'Échec de l’inscription. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
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
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="mt-1 border-gray-300 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="mt-1 border-gray-300 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <Label htmlFor="emailOrPhone">Email ou Téléphone</Label>
              <Input
                id="emailOrPhone"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="exemple@gmail.com ou +25712345678"
                className="mt-1 border-gray-300 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="exemple@gmail.com ou +25712345678"
                className="mt-1 border-gray-300 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder="Kinama gitega...."
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