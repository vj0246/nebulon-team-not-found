/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FinancialData {
  date: string;
  revenue: number;
  expenses: number;
  profit: number;
  cashFlow: number;
  growth: number;
}

export const mockFinancials: FinancialData[] = [
  { date: '2025-01', revenue: 45000, expenses: 32000, profit: 13000, cashFlow: 15000, growth: 5 },
  { date: '2025-02', revenue: 48000, expenses: 34000, profit: 14000, cashFlow: 12000, growth: 6.5 },
  { date: '2025-03', revenue: 52000, expenses: 35000, profit: 17000, cashFlow: 18000, growth: 8.3 },
  { date: '2025-04', revenue: 50000, expenses: 38000, profit: 12000, cashFlow: 10000, growth: -3.8 }, // Anomaly: High expenses
  { date: '2025-05', revenue: 55000, expenses: 36000, profit: 19000, cashFlow: 22000, growth: 10 },
  { date: '2025-06', revenue: 60000, expenses: 38000, profit: 22000, cashFlow: 25000, growth: 9.1 },
  { date: '2025-07', revenue: 62000, expenses: 40000, profit: 22000, cashFlow: 20000, growth: 3.3 },
  { date: '2025-08', revenue: 58000, expenses: 42000, profit: 16000, cashFlow: 14000, growth: -6.4 }, // Seasonal dip
  { date: '2025-09', revenue: 65000, expenses: 41000, profit: 24000, cashFlow: 28000, growth: 12 },
  { date: '2025-10', revenue: 70000, expenses: 43000, profit: 27000, cashFlow: 32000, growth: 7.7 },
  { date: '2025-11', revenue: 75000, expenses: 45000, profit: 30000, cashFlow: 35000, growth: 7.1 },
  { date: '2025-12', revenue: 85000, expenses: 50000, profit: 35000, cashFlow: 42000, growth: 13.3 },
];

export const kpis = {
  totalRevenue: 765000,
  totalProfit: 251000,
  avgGrowth: 6.8,
  cashReserve: 125000,
  burnRate: 38000,
  runway: 3.2,
};

export const newsData = [
  {
    id: 1,
    title: "SME Tax Reforms 2026: What You Need to Know",
    summary: "New tax incentives for small businesses focusing on digital transformation.",
    image: "https://picsum.photos/seed/finance1/800/600",
    recommendation: "Consider investing in software upgrades this quarter to maximize tax credits.",
    domain: "FinTech"
  },
  {
    id: 2,
    title: "Global Supply Chain Trends",
    summary: "Logistics costs are stabilizing, but regional disruptions persist.",
    image: "https://picsum.photos/seed/logistics/800/600",
    recommendation: "Diversify your supplier base to mitigate regional risks.",
    domain: "Operations"
  },
  {
    id: 3,
    title: "AI in Small Business Accounting",
    summary: "How automation is reducing manual entry errors by 40%.",
    image: "https://picsum.photos/seed/ai/800/600",
    recommendation: "Integrate AI-driven reconciliation tools to save 10+ hours weekly.",
    domain: "Accounting"
  }
];

export const recentTransactions = [
  { id: 1, date: '2026-03-24', category: 'Office Supplies', amount: -450.00, status: 'Completed', icon: '💰' },
  { id: 2, date: '2026-03-23', category: 'Client Payment', amount: 2500.00, status: 'Completed', icon: '📈' },
  { id: 3, date: '2026-03-22', category: 'Software Sub', amount: -120.00, status: 'Completed', icon: '💻' },
  { id: 4, date: '2026-03-21', category: 'Consulting', amount: 1200.00, status: 'Completed', icon: '🤝' },
  { id: 5, date: '2026-03-20', category: 'Utility Bills', amount: -300.00, status: 'Completed', icon: '⚡' },
];
