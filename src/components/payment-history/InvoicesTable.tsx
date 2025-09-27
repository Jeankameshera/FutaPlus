
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

// Types
export interface Invoice {
  id: number;
  service: string;
  reference: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: string;
}


interface InvoicesTableProps {
  invoices: Invoice[];
  getStatusBadge: (status: string) => string;
}

const InvoicesTable: React.FC<InvoicesTableProps> = ({ 
  invoices, 
  getStatusBadge 
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 text-xs uppercase text-gray-600">
          <tr>
            <th className="px-4 py-3 text-left">Service</th>
            <th className="px-4 py-3 text-left">Date d'émission</th>
            <th className="px-4 py-3 text-left">Date limite</th>
            <th className="px-4 py-3 text-left">Montant</th>
            <th className="px-4 py-3 text-left">Statut</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="border-b">
              <td className="px-4 py-4">
                <div>
                  <p className="font-medium">{invoice.service}</p>
                  <p className="text-xs text-gray-500">{invoice.reference}</p>
                </div>
              </td>
              <td className="px-4 py-4">{invoice.issueDate}</td>
              <td className="px-4 py-4">{invoice.dueDate}</td>
              <td className="px-4 py-4 font-medium">{invoice.amount.toLocaleString()} FC</td>
              <td className="px-4 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(invoice.status)}`}>
                  {invoice.status}
                </span>
              </td>
              <td className="px-4 py-4">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Download size={14} className="mr-1" />
                    Facture
                  </Button>
                  {invoice.status !== 'Payé' && (
                    <Button size="sm" className="flex items-center bg-blue-600 hover:bg-blue-700 text-white">
                      Payer
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoicesTable;
