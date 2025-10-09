// src/components/payment-history/InvoicesTable.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Types
export interface Invoice {
  id: number;
  service: string;
  reference: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: string;
  paymentMethod?: string;
  first_name: string;
  last_name: string;
  address: string;
  phone: string;
  meter_number?: string;
  service_slug?: string;
  payment_id?: number | null;
}

interface InvoicesTableProps {
  invoices: Invoice[];
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

const InvoicesTable: React.FC<InvoicesTableProps> = ({ invoices, getStatusBadge }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const downloadInvoicePDF = async (invoice: Invoice) => {
    try {
      const res = await fetch('/templates/invoiceTemplate.html');
      let templateHtml = await res.text();

      templateHtml = fillTemplate(templateHtml, {
        id: invoice.id,
        first_name: invoice.first_name,
        last_name: invoice.last_name,
        service_name: invoice.service,
        month: invoice.issueDate,
        meter_number: invoice.meter_number || '',
        amount: (invoice.amount || 0).toLocaleString(),
        status: invoice.status,
        payment_method: invoice.paymentMethod || 'N/A',
        created_at: invoice.issueDate,
        invoice_numbers: invoice.reference,
        token_section: invoice.payment_id || ''
      });

      const div = document.createElement('div');
      div.innerHTML = templateHtml;
      document.body.appendChild(div);

      const canvas = await html2canvas(div, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`facture_${invoice.id}.pdf`);

      document.body.removeChild(div);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erreur',
        description: 'Impossible de télécharger la facture.',
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
            <th className="px-4 py-3 text-left">Date d'émission</th>
            <th className="px-4 py-3 text-left">Date limite</th>
            <th className="px-4 py-3 text-left">Montant</th>
            <th className="px-4 py-3 text-left">Statut</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-4">
                <div>
                  <p className="font-medium">{invoice.service}</p>
                  <p className="text-xs text-gray-500">{invoice.reference}</p>
                </div>
              </td>
              <td className="px-4 py-4 text-sm">{invoice.issueDate}</td>
              <td className="px-4 py-4 text-sm">{invoice.dueDate}</td>
              <td className="px-4 py-4 font-medium">{(invoice.amount || 0).toLocaleString()} FC</td>
              <td className="px-4 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(invoice.status)}`}>
                  {invoice.status}
                </span>
              </td>
              <td className="px-4 py-4">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                    onClick={() => downloadInvoicePDF(invoice)}
                  >
                    <Download size={14} className="mr-1" />
                    {invoice.status === 'paid' ? 'Reçu' : 'Facture'}
                  </Button>
                  {invoice.status !== 'paid' && invoice.service_slug && (
                    <Button
                      size="sm"
                      className="flex items-center bg-orange-600 hover:bg-orange-700 text-white"
                      onClick={() => navigate(`/${invoice.service_slug}`)}
                    >
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