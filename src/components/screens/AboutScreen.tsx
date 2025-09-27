
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutScreen: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Button 
        variant="outline" 
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={16} className="mr-2" />
        Retour
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>À propos de l'application</CardTitle>
          <CardDescription>Informations sur notre plateforme de gestion académique</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Notre Mission</h2>
            <p>
              Notre plateforme de gestion académique vise à simplifier et améliorer la communication entre étudiants, 
              enseignants et administrateurs dans un environnement éducatif moderne. En centralisant les informations 
              et en facilitant les échanges, nous souhaitons créer une communauté d'apprentissage plus connectée et efficace.
            </p>
            
            <h2 className="text-xl font-semibold mt-6">Fonctionnalités</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Gestion des cours et des emplois du temps</li>
              <li>Communication directe entre étudiants et enseignants</li>
              <li>Suivi des notes et des performances académiques</li>
              <li>Notifications personnalisées pour les événements importants</li>
              <li>Accès aux ressources pédagogiques</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6">Contactez-nous</h2>
            <p>
              Pour toute question ou suggestion concernant notre plateforme, n'hésitez pas à nous contacter à 
              l'adresse <a href="mailto:support@academicapp.fr" className="text-blue-600 hover:underline">support@academicapp.fr</a> 
              ou par téléphone au 01 23 45 67 89.
            </p>
            
            <h2 className="text-xl font-semibold mt-6">Version</h2>
            <p>Version 1.0.0 - Mai 2023</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutScreen;
