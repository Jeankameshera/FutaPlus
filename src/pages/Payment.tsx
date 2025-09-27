
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Smartphone, Wallet, Check, ArrowRight } from 'lucide-react';

const Payment = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('mobile');
  const [loading, setLoading] = useState(false);
  
  // Mock service data
  const getServiceDetails = (serviceId: string) => {
    const services = {
      '1': {
        id: 1,
        name: 'REGIDESO',
        amount: 25000,
        reference: 'REG-2023-12345'
      },
      '2': {
        id: 2,
        name: 'SNEL',
        amount: 15000,
        reference: 'SNEL-2023-67890'
      },
      '3': {
        id: 3,
        name: 'Vignette Auto',
        amount: 45000,
        reference: 'VIG-2023-24680'
      },
      '4': {
        id: 4,
        name: 'Internet',
        amount: 35000,
        reference: 'INT-2023-13579'
      }
    };
    
    return services[serviceId as keyof typeof services] || {
      id: Number(serviceId),
      name: 'Service inconnu',
      amount: 0,
      reference: '-'
    };
  };
  
  const service = getServiceDetails(serviceId || '1');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: 'Paiement réussi',
        description: `Vous avez payé ${service.amount.toLocaleString()} FC pour ${service.name}`,
      });
      navigate('/history');
      setLoading(false);
    }, 2000);
  };
  
  return (
    <Layout title="Paiement">
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Paiement</h1>
          <p className="text-gray-600">{service.name} - {service.reference}</p>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Montant à payer</p>
                <p className="text-2xl font-bold">{service.amount.toLocaleString()} FC</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Service</p>
                <p className="font-medium">{service.name}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Référence</p>
                <p className="font-medium">{service.reference}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Méthode de paiement</h2>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
              <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="mobile" id="mobile" />
                <Label htmlFor="mobile" className="flex items-center cursor-pointer">
                  <Smartphone className="mr-2 text-blue-500" />
                  <div>
                    <p className="font-medium">Mobile Money</p>
                    <p className="text-sm text-gray-500">M-Pesa, Airtel Money, Orange Money</p>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center cursor-pointer">
                  <CreditCard className="mr-2 text-blue-500" />
                  <div>
                    <p className="font-medium">Carte bancaire</p>
                    <p className="text-sm text-gray-500">Visa, Mastercard</p>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="wallet" id="wallet" />
                <Label htmlFor="wallet" className="flex items-center cursor-pointer">
                  <Wallet className="mr-2 text-blue-500" />
                  <div>
                    <p className="font-medium">Portefeuille électronique</p>
                    <p className="text-sm text-gray-500">PayPal, Payoneer</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          {paymentMethod === 'mobile' && (
            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input id="phone" placeholder="Ex: 099 123 4567" required />
              </div>
            </div>
          )}
          
          {paymentMethod === 'card' && (
            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="card-number">Numéro de carte</Label>
                <Input id="card-number" placeholder="1234 5678 9012 3456" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Date d'expiration</Label>
                  <Input id="expiry" placeholder="MM/YY" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="card-name">Nom sur la carte</Label>
                <Input id="card-name" placeholder="Jean Dupont" required />
              </div>
            </div>
          )}
          
          {paymentMethod === 'wallet' && (
            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email du compte</Label>
                <Input id="email" type="email" placeholder="email@exemple.com" required />
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-500"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  Traitement en cours... <ArrowRight className="ml-2" />
                </span>
              ) : (
                <span className="flex items-center">
                  Confirmer le paiement <Check className="ml-2" />
                </span>
              )}
            </Button>
            
            <Button 
              type="button"
              variant="outline" 
              className="w-full" 
              onClick={() => navigate(`/service/${serviceId}`)}
              disabled={loading}
            >
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Payment;
