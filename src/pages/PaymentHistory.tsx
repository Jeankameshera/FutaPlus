import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Custom components
import FilterBar from '@/components/payment-history/FilterBar';
import TransactionsTable from '@/components/payment-history/TransactionsTable';
import InvoicesTable from '@/components/payment-history/InvoicesTable';

// Utilities and data
import { getStatusBadge } from '@/utils/statusBadge';
import { transactions as allTransactions, invoices as allInvoices } from '@/data/paymentData';

// Helper function to filter by period (ex. semaine, mois, année, etc.)
const filterByPeriod = (items, period) => {
  if (period === 'all') return items;

  const now = new Date();
  return items.filter((item) => {
    const itemDate = new Date(item.date); // date format must be valid 
    const diffTime = now.getTime() - itemDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);

    switch (period) {
      case 'week':
        return diffDays <= 7;
      case 'month':
        return diffDays <= 30;
      case 'year':
        return diffDays <= 365;
      default:
        return true;
    }
  });
};

const PaymentHistory = () => {
  const [filterPeriod, setFilterPeriod] = useState('all');
  const navigate = useNavigate();

  const filteredTransactions = filterByPeriod(allTransactions, filterPeriod);
  const filteredInvoices = filterByPeriod(allInvoices, filterPeriod);

  return (
    <Layout title="Historique">
      <div className="p-4 md:p-6">

        {/* Bouton retour */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center text-sm text-orange-600 hover:text-orange-800 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Historique des paiements</h1>
          <p className="text-gray-600">Consultez vos paiements et factures</p>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-6">
            <FilterBar 
              filterPeriod={filterPeriod} 
              setFilterPeriod={setFilterPeriod} 
            />

            <Tabs defaultValue="transactions" className="mt-4">
              <TabsList className="mb-4">
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="invoices">Factures</TabsTrigger>
              </TabsList>

              <TabsContent value="transactions">
                <TransactionsTable 
                  transactions={filteredTransactions} 
                  getStatusBadge={getStatusBadge} 
                />
              </TabsContent>

              <TabsContent value="invoices">
                <InvoicesTable 
                  invoices={filteredInvoices} 
                  getStatusBadge={getStatusBadge} 
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PaymentHistory;
