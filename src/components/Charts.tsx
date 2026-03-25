/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, 
  LineChart, Line, Cell, PieChart, Pie, Legend,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { mockFinancials } from '../data/mockData';

const COLORS = ['#FFD700', '#B8860B', '#FFFACD', '#DAA520', '#FFEC8B'];

// Mock data for Radar Chart (Profitability Metrics)
const radarData = [
  { subject: 'Net Margin', A: 120, fullMark: 150 },
  { subject: 'Operating Efficiency', A: 98, fullMark: 150 },
  { subject: 'Asset Turnover', A: 86, fullMark: 150 },
  { subject: 'Inventory Turnover', A: 99, fullMark: 150 },
  { subject: 'ROI', A: 85, fullMark: 150 },
  { subject: 'Liquidity', A: 65, fullMark: 150 },
];

export const RevenueExpenseChart = () => (
  <div className="space-y-4">
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={mockFinancials}>
        <defs>
          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2}/>
            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
        <XAxis 
          dataKey="date" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
          tickFormatter={(v) => `$${v/1000}k`}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'var(--chart-tooltip-bg)', 
            borderRadius: '12px', 
            border: '1px solid var(--chart-tooltip-border)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }} 
        />
        <Area 
          type="monotone" 
          dataKey="revenue" 
          stroke="#FFD700" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorRev)" 
          name="Revenue"
        />
        <Area 
          type="monotone" 
          dataKey="expenses" 
          stroke="#94a3b8" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorExp)" 
          name="Expenses"
        />
      </AreaChart>
    </ResponsiveContainer>
    <div className="p-4 bg-gold/5 dark:bg-gold/10 border border-gold/10 rounded-xl">
      <p className="text-xs font-black text-gold uppercase tracking-widest">Business Insight</p>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
        Revenue is outpacing expenses by 12%. <span className="font-bold text-slate-800 dark:text-slate-200">Next Step:</span> Reinvest surplus into high-margin inventory like "Premium Tech Accessories" to capitalize on current demand trends.
      </p>
    </div>
  </div>
);

export const ProfitabilitySpiderChart = () => (
  <div className="space-y-4">
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
        <PolarGrid stroke="var(--chart-grid)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--chart-text)', fontSize: 10 }} />
        <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
        <Radar
          name="Business Performance"
          dataKey="A"
          stroke="#FFD700"
          fill="#FFD700"
          fillOpacity={0.6}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'var(--chart-tooltip-bg)', 
            borderRadius: '12px', 
            border: '1px solid var(--chart-tooltip-border)'
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
    <div className="p-4 bg-gold/5 dark:bg-gold/10 border border-gold/10 rounded-xl">
      <p className="text-xs font-black text-gold uppercase tracking-widest">Profitability Insight</p>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
        Your "Operating Efficiency" is high, but "Liquidity" is lagging. <span className="font-bold text-slate-800 dark:text-slate-200">Next Step:</span> Focus on faster invoice collection to improve cash-on-hand before the Q3 expansion.
      </p>
    </div>
  </div>
);

export const CashFlowChart = () => (
  <div className="space-y-4">
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={mockFinancials}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--chart-text)', fontSize: 12 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--chart-text)', fontSize: 12 }} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'var(--chart-tooltip-bg)', 
            borderRadius: '12px', 
            border: '1px solid var(--chart-tooltip-border)'
          }}
        />
        <Line 
          type="stepAfter" 
          dataKey="cashFlow" 
          stroke="#FFD700" 
          strokeWidth={3} 
          dot={{ r: 4, fill: '#FFD700', strokeWidth: 2, stroke: '#fff' }}
          activeDot={{ r: 6, strokeWidth: 0 }}
          name="Cash Flow"
        />
      </LineChart>
    </ResponsiveContainer>
    <div className="p-4 bg-gold/5 dark:bg-gold/10 border border-gold/10 rounded-xl">
      <p className="text-xs font-black text-gold uppercase tracking-widest">Cash Flow Insight</p>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
        Projected dip in April due to tax payments. <span className="font-bold text-slate-800 dark:text-slate-200">Recommendation:</span> Delay non-essential equipment purchases until May to maintain a safety buffer.
      </p>
    </div>
  </div>
);

export const GrowthTrendChart = () => (
  <div className="space-y-4">
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={mockFinancials}>
        <XAxis dataKey="date" hide />
        <YAxis hide />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'var(--chart-tooltip-bg)', 
            borderRadius: '12px', 
            border: '1px solid var(--chart-tooltip-border)'
          }}
        />
        <Area 
          type="monotone" 
          dataKey="growth" 
          stroke="#FFD700" 
          fill="#FFD70033" 
          strokeWidth={2}
          name="Growth %"
        />
      </AreaChart>
    </ResponsiveContainer>
    <div className="p-4 bg-gold/5 dark:bg-gold/10 border border-gold/10 rounded-xl">
      <p className="text-xs font-black text-gold uppercase tracking-widest">Growth Insight</p>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
        Growth is stabilizing at 7%. <span className="font-bold text-slate-800 dark:text-slate-200">Strategy:</span> Launch a customer loyalty program now to increase lifetime value (LTV) and secure recurring revenue.
      </p>
    </div>
  </div>
);
