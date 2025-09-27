

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();


  // se connecter avec E-mail ou numéro et password
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (email === 'kamesherajean@gmail.com' && password === '1234') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);

        toast({
          title: 'Connexion réussie',
          description: 'Bienvenue sur votre application de paiement',
        });
        navigate('/dashboard');
      } else {
        toast({
          title: 'Erreur de connexion',
          description: 'Identifiants incorrects. Veuillez réessayer.',
          variant: 'destructive',
        });
      }
      setLoading(false);
    }, 1000);
  };

   // Connexion via Google
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/home');
    } catch (error) {
      toast({
        title: 'Erreur Google',
        description: 'Échec de la connexion avec Google.',
        variant: 'destructive',
      });
    }
  };

   // Connexion via Facebook
  const handleFacebookLogin = async () => {
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/home');
    } catch (error) {
      toast({
        title: 'Erreur Facebook',
        description: 'Échec de la connexion avec Facebook.',
        variant: 'destructive',
      });
    }
  };

   // Réinitialisation du mot de passe
  const handleForgotPassword = () => {
    const userEmail = prompt("Entrez votre adresse email pour réinitialiser votre mot de passe :");
    if (userEmail) {

      // ici on fais appel au service de reset, genre service de réinitialisation (ex : Firebase, ou backend custom)
      toast({
        title: "Email envoyé",
        description: `Un lien de réinitialisation a été envoyé à ${userEmail}`,
      });
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
                <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-orange-400 hover:underline">Forgot password</button>

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

           {/* === Connexion avec Google ou Facebook === */}
          <div className="my-6 flex items-center justify-center text-sm text-white/80">
            <span className="px-2">Ou continuer avec</span>
          </div>

           {/* === Google  === */}
          <div className="flex justify-center gap-4">
          <FcGoogle onClick={handleGoogleLogin} className="text-3xl cursor-pointer" />          

           {/* ===  Facebook === */}
          <FaFacebook onClick={handleFacebookLogin} className="text-3xl text-white cursor-pointer" />
        </div>

         {/* === Signg up === */}
          <div className="mt-6 text-center text-sm">
            <p>
              Pas encore de compte ?{''}
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
