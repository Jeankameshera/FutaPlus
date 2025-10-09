// src/pages/PaymentHistory.tsx
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '@/api/api';
import { useToast } from '@/hooks/use-toast';
import FilterBar from '@/components/payment-history/FilterBar';
import TransactionsTable from '@/components/payment-history/TransactionsTable';
import InvoicesTable from '@/components/payment-history/InvoicesTable';
import { getStatusBadge } from '@/utils/statusBadge';

// Fonction utilitaire pour créer des dates sûres
const safeDate = (dateString) => {
  if (!dateString) return new Date(); // Date actuelle par défaut
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? new Date() : date;
};

// Fonction pour formater la date en string sécurisée
const formatSafeDate = (dateString, defaultValue = 'N/A') => {
  if (!dateString) return defaultValue;
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? defaultValue : date.toISOString().split('T')[0];
  } catch {
    return defaultValue;
  }
};

const filterByPeriod = (items, period) => {
  if (period === 'all') return items;

  const now = new Date();
  return items.filter((item) => {
    const itemDate = safeDate(item.date || item.created_at || item.issueDate || item.month);
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

const filterBySearch = (items, query) => {
  if (!query) return items;
  const lowerQuery = query.toLowerCase();
  return items.filter(
    (item) =>
      (item.first_name?.toLowerCase().includes(lowerQuery) || false) ||
      (item.last_name?.toLowerCase().includes(lowerQuery) || false) ||
      (item.reference?.toLowerCase().includes(lowerQuery) || false) ||
      (item.service?.toLowerCase().includes(lowerQuery) || false)
  );
};

const PaymentHistory = () => {
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionsRes, invoicesRes] = await Promise.all([
          api.get('/payments'),
          api.get('/invoices/user'),
        ]);

        console.log('Transactions API response:', transactionsRes.data);
        console.log('Invoices API response:', invoicesRes.data);

        // Traitement sécurisé des transactions
        const transactionsData = Array.isArray(transactionsRes.data)
          ? transactionsRes.data.map((t) => ({
              id: t.id,
              last_name: t.last_name || 'N/A',
              first_name: t.first_name || 'N/A',
              service: t.service || 'Service inconnu',
              reference: t.invoice_number || t.token || t.plan || `TR-${t.id}`,
              date: formatSafeDate(t.created_at, 'Date inconnue'),
              amount: t.amount || 0,
              status: t.status || 'inconnu',
              paymentMethod: t.payment_method || 'N/A',
              address: t.address || 'N/A',
              phone: t.phone || 'N/A',
              meter_number: t.meter_number || 'N/A'
            }))
          : [];

        // Traitement sécurisé des factures
        const invoicesData = Array.isArray(invoicesRes.data)
          ? invoicesRes.data.map((i) => {
              const issueDate = safeDate(i.month);
              const dueDate = new Date(issueDate);
              dueDate.setDate(issueDate.getDate() + 30);
              
              return {
                id: i.id,
                last_name: i.last_name || 'N/A',
                first_name: i.first_name || 'N/A',
                service: i.service || 'Service inconnu',
                reference: i.meter_number || `FACT-${i.id}`,
                issueDate: formatSafeDate(i.month, 'Date inconnue'),
                dueDate: i.status === 'paid' ? 'Payée' : formatSafeDate(dueDate),
                amount: i.amount || 0,
                status: i.status || 'unpaid',
                service_slug: i.service_slug || 'unknown',
                payment_id: i.payment_id || null,
                address: i.address || 'N/A',
                phone: i.phone || 'N/A',
                meter_number: i.meter_number || 'N/A',
                paymentMethod: i.payment_method || 'N/A'
              };
            })
          : [];

        console.log('Processed transactions:', transactionsData);
        console.log('Processed invoices:', invoicesData);

        setTransactions(transactionsData);
        setInvoices(invoicesData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger l\'historique.',
          variant: 'destructive',
        });
        setTransactions([]);
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const filteredTransactions = filterBySearch(
    filterByPeriod(transactions, filterPeriod),
    searchQuery
  );

  const filteredInvoices = filterBySearch(
    filterByPeriod(invoices, filterPeriod),
    searchQuery
  );

  if (loading) {
    return (
      <Layout title="Historique">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Historique">
      <div className="p-4 md:p-6">
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
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            <Tabs defaultValue="transactions" className="mt-4">
              <TabsList className="mb-4">
                <TabsTrigger value="transactions">
                  Transactions ({filteredTransactions.length})
                </TabsTrigger>
                <TabsTrigger value="invoices">
                  Factures ({filteredInvoices.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="transactions">
                {filteredTransactions.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p>Aucune transaction trouvée</p>
                    <p className="text-sm mt-2">Vos transactions apparaîtront ici après paiement</p>
                  </div>
                ) : (
                  <TransactionsTable
                    transactions={filteredTransactions}
                    getStatusBadge={getStatusBadge}
                  />
                )}
              </TabsContent>

              <TabsContent value="invoices">
                {filteredInvoices.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p>Aucune facture disponible</p>
                    <p className="text-sm mt-2">Vos factures apparaîtront ici</p>
                  </div>
                ) : (
                  <InvoicesTable invoices={filteredInvoices} getStatusBadge={getStatusBadge} />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PaymentHistory;