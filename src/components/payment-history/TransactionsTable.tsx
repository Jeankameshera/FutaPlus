// src/components/payment-history/TransactionsTable.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Types
export interface Transaction {
  id: number;
  service: string;
  reference: string;
  date: string;
  amount: number;
  status: string;
  paymentMethod: string;
  first_name: string;
  last_name: string;
  address: string;
  phone: string;
  meter_number: string;
}

interface TransactionsTableProps {
  transactions: Transaction[];
  getStatusBadge: (status: string) => string;
}

// Fonction pour remplir les placeholders
const fillTemplate = (template: string, data: Record<string, string | number>) => {
  let html = template;
  for (const key in data) {
    html = html.replaceAll(`{{${key}}}`, String(data[key] || 'N/A'));
  }
  return html;
};

const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions, getStatusBadge }) => {
  const { toast } = useToast();

  const downloadReceipt = async (transaction: Transaction) => {
    try {
      // Charger le template HTML depuis /public/templates
      const res = await fetch('/templates/receiptTemplate.html');
      let templateHtml = await res.text();

      // Remplacer les placeholders avec valeurs par défaut
      templateHtml = fillTemplate(templateHtml, {
        id: transaction.id,
        first_name: transaction.first_name,
        last_name: transaction.last_name,
        service_name: transaction.service,
        month: transaction.date,
        meter_number: transaction.meter_number,
        amount: transaction.amount?.toLocaleString() || '0',
        status: transaction.status,
      });

      // Créer un div temporaire pour convertir en PDF
      const div = document.createElement('div');
      div.innerHTML = templateHtml;
      document.body.appendChild(div);

      const canvas = await html2canvas(div, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`recu_${transaction.id}.pdf`);

      document.body.removeChild(div);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erreur',
        description: 'Impossible de télécharger le reçu.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 text-xs uppercase text-gray-600">
          <tr>
            <th className="px-4 py-3 text-left">Service</th>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Montant</th>
            <th className="px-4 py-3 text-left">Statut</th>
            <th className="px-4 py-3 text-left">Méthode</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-4">
                <div>
                  <p className="font-medium">{transaction.service}</p>
                  <p className="text-xs text-gray-500">{transaction.reference}</p>
                </div>
              </td>
              <td className="px-4 py-4 text-sm">{transaction.date}</td>
              <td className="px-4 py-4 font-medium">
                {(transaction.amount || 0).toLocaleString()} FC
              </td>
              <td className="px-4 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(transaction.status)}`}>
                  {transaction.status}
                </span>
              </td>
              <td className="px-4 py-4 text-sm">{transaction.paymentMethod}</td>
              <td className="px-4 py-4">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                    onClick={() => downloadReceipt(transaction)}
                  >
                    <Download size={14} className="mr-1" />
                    Reçu
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <RefreshCw size={14} className="mr-1" />
                    Répéter
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;