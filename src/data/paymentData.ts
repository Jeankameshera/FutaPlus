
import { Transaction } from '@/components/payment-history/TransactionsTable';
import { Invoice } from '@/components/payment-history/InvoicesTable';

// Mock transaction data
export const transactions: Transaction[] = [
  {
    id: 1,
    service: 'REGIDESO',
    reference: 'REG-2023-12345',
    date: '23/05/2025',
    amount: 25000,
    status: 'Réussi',
    paymentMethod: 'Mobile Money'
  },
  {
    id: 2,
    service: 'SNEL',
    reference: 'SNEL-2023-67890',
    date: '20/05/2025',
    amount: 15000,
    status: 'Réussi',
    paymentMethod: 'Carte bancaire'
  },
  {
    id: 3,
    service: 'Vignette Auto',
    reference: 'VIG-2023-24680',
    date: '18/05/2025',
    amount: 45000,
    status: 'En attente',
    paymentMethod: 'Mobile Money'
  },
  {
    id: 4,
    service: 'Internet',
    reference: 'INT-2023-13579',
    date: '15/05/2025',
    amount: 35000,
    status: 'Réussi',
    paymentMethod: 'Portefeuille électronique'
  },
  {
    id: 5,
    service: 'Impôts',
    reference: 'IMP-2023-97531',
    date: '10/05/2025',
    amount: 50000,
    status: 'Réussi',
    paymentMethod: 'Mobile Money'
  }
];

// Mock invoice data
export const invoices: Invoice[] = [
  {
    id: 1,
    service: 'REGIDESO',
    reference: 'FACT-REG-12345',
    issueDate: '15/05/2025',
    dueDate: '30/05/2025',
    amount: 25000,
    status: 'Payé'
  },
  {
    id: 2,
    service: 'SNEL',
    reference: 'FACT-SNEL-67890',
    issueDate: '12/05/2025',
    dueDate: '27/05/2025',
    amount: 15000,
    status: 'Payé'
  },
  {
    id: 3,
    service: 'Vignette Auto',
    reference: 'FACT-VIG-24680',
    issueDate: '10/05/2025',
    dueDate: '25/05/2025',
    amount: 45000,
    status: 'En attente'
  },
  {
    id: 4,
    service: 'Internet',
    reference: 'FACT-INT-13579',
    issueDate: '05/05/2025',
    dueDate: '20/05/2025',
    amount: 35000,
    status: 'Payé'
  },
  {
    id: 5,
    service: 'Impôts',
    reference: 'FACT-IMP-97531',
    issueDate: '01/05/2025',
    dueDate: '16/05/2025',
    amount: 50000,
    status: 'Payé'
  }
];
