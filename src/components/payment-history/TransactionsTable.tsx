
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';

// Types
export interface Transaction {
  id: number;
  service: string;
  reference: string;
  date: string;
  amount: number;
  status: string;
  paymentMethod: string;
}

interface TransactionsTableProps {
  transactions: Transaction[];
  getStatusBadge: (status: string) => string;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ 
  transactions, 
  getStatusBadge 
}) => {
  function generatePDF(transaction: Transaction): void {
    throw new Error('Function not implemented.');
  }

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
            <tr key={transaction.id} className="border-b">
              <td className="px-4 py-4">
                <div>
                  <p className="font-medium">{transaction.service}</p>
                  <p className="text-xs text-gray-500">{transaction.reference}</p>
                </div>
              </td>
              <td className="px-4 py-4">{transaction.date}</td>
              <td className="px-4 py-4 font-medium">{transaction.amount.toLocaleString()} FC</td>
              <td className="px-4 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(transaction.status)}`}>
                  {transaction.status}
                </span>
              </td>
              <td className="px-4 py-4">{transaction.paymentMethod}</td>
              <td className="px-4 py-4">
                <div className="flex space-x-2">
                  
                  <Button
                     variant="outline"
                            size="sm"
                           className="flex items-center"
                              onClick={() => generatePDF(transaction)}
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
