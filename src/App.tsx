/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, LayoutDashboard, PieChart as LucidePieChart, TrendingUp, 
  DollarSign, Target, FileText, Settings, MessageSquare, 
  PlusCircle, Newspaper, ChevronDown, ChevronRight,
  Sun, Moon, LogIn, UserPlus, BarChart3, Activity,
  ArrowUpRight, ArrowDownRight, Zap, ShieldCheck,
  Search, Bell, User, Coins, Briefcase, Wallet,
  Upload, Trash2, CheckCircle2, Calendar, Filter,
  Lightbulb, Rocket, Share2, Download, TrendingDown,
  Globe, Scale
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GoogleGenAI } from "@google/genai";
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip 
} from 'recharts';

// Mock Data
import { mockFinancials, kpis, newsData, recentTransactions } from './data/mockData';

// Charts
import { 
  RevenueExpenseChart, ProfitabilitySpiderChart, 
  CashFlowChart, GrowthTrendChart 
} from './components/Charts';

// Utils
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (v: boolean) => void }) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['analysis']);
  const location = useLocation();

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const menuItems = [
    { id: 'dash', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { 
      id: 'analysis', 
      label: 'Analysis', 
      icon: BarChart3,
      children: [
        { label: 'KPI Explorer', path: '/kpi' },
        { label: 'Profitability', path: '/profitability' },
        { label: 'Cash Flow', path: '/cashflow' },
        { label: 'Growth Trends', path: '/growth' },
        { label: 'Goal Seek', path: '/goalseek' },
        { label: 'Compare', path: '/compare' },
        { label: 'Financials', path: '/financials' },
      ]
    },
    { id: 'summary', label: 'Summary Report', icon: FileText, path: '/summary' },
    { id: 'trans', label: 'Transactions', icon: DollarSign, path: '/transactions' },
    { id: 'goals', label: 'Goal Tracking', icon: Target, path: '/goals' },
    { id: 'insights', label: 'Insights', icon: Zap, path: '/insights' },
    { id: 'news', label: 'Market News', icon: Newspaper, path: '/news' },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={cn(
          "fixed top-0 left-0 h-full w-72 bg-white dark:bg-slate-950 border-r border-gold/20 shadow-2xl z-50 overflow-y-auto transition-colors",
          !isOpen && "pointer-events-none lg:pointer-events-auto lg:translate-x-0"
        )}
      >
        <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gold rounded-lg flex items-center justify-center shadow-md">
              <ShieldCheck className="text-slate-900" size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-white">SME<span className="text-gold">Pulse</span></span>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg lg:hidden">
            <X size={20} className="text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              {item.children ? (
                <div className="space-y-1">
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gold/5 text-slate-600 dark:text-slate-400 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} className="text-gold group-hover:scale-110 transition-transform" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {expandedMenus.includes(item.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  <AnimatePresence>
                    {expandedMenus.includes(item.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-11 space-y-1"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={cn(
                              "block p-2 text-sm rounded-lg transition-colors",
                              location.pathname === child.path 
                                ? "bg-gold/10 text-gold-dark dark:text-gold font-semibold" 
                                : "text-slate-500 dark:text-slate-400 hover:text-gold"
                            )}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to={item.path!}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl transition-all group",
                    location.pathname === item.path 
                      ? "bg-gold text-slate-900 font-bold shadow-lg shadow-gold/20" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-gold/5 hover:text-gold"
                  )}
                >
                  <item.icon size={20} className={cn(location.pathname === item.path ? "text-slate-900" : "group-hover:scale-110 transition-transform")} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </motion.aside>
    </>
  );
};

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 p-1 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center text-gold font-bold text-xs shadow-inner">
          JB
        </div>
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 hidden sm:block">John B.</span>
        <ChevronDown size={14} className={cn("text-slate-400 transition-transform", isOpen && "rotate-180")} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gold/10 p-2 z-50 overflow-hidden"
          >
            <div className="p-3 border-b border-slate-100 dark:border-slate-800 mb-2">
              <p className="text-sm font-bold text-slate-800 dark:text-white">John Business</p>
              <p className="text-xs text-slate-500">ceo@techsme.com</p>
            </div>
            <button className="w-full flex items-center gap-3 p-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-gold/5 hover:text-gold rounded-xl transition-colors">
              <User size={16} /> My Profile
            </button>
            <button className="w-full flex items-center gap-3 p-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-gold/5 hover:text-gold rounded-xl transition-colors">
              <Settings size={16} /> Settings
            </button>
            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2 mx-2"></div>
            <Link to="/login" className="w-full flex items-center gap-3 p-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors">
              <LogIn size={16} /> Logout
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Header = ({ onMenuClick, isDark, toggleDark }: { onMenuClick: () => void; isDark: boolean; toggleDark: () => void }) => {
  const [search, setSearch] = useState('');
  const location = useLocation();

  const navLinks = [
    { label: 'Overview', path: '/' },
    { label: 'Transactions', path: '/transactions' },
    { label: 'Summary', path: '/summary' },
    { label: 'Insights', path: '/insights' },
    { label: 'Market News', path: '/news' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 px-6 py-3 flex items-center justify-between transition-all duration-300">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 lg:hidden">
          <div className="w-9 h-9 bg-gold rounded-lg flex items-center justify-center text-slate-900 shadow-md">
            <ShieldCheck size={20} />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">SME<span className="text-gold">Pulse</span></span>
        </div>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-semibold transition-all tracking-tight",
                location.pathname === link.path
                  ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white"
                  : "text-slate-500 dark:text-slate-400 hover:text-gold"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center relative group">
          <Search className="absolute left-4 text-slate-400 group-focus-within:text-gold transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search..."
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-gold dark:focus:border-gold transition-all w-64"
          />
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={toggleDark}
            className="p-3 bg-slate-50 dark:bg-slate-900 hover:bg-gold/10 rounded-2xl text-slate-500 transition-all group"
          >
            {isDark ? <Sun size={20} className="text-gold group-hover:rotate-90 transition-transform duration-500" /> : <Moon size={20} className="group-hover:-rotate-12 transition-transform duration-500" />}
          </button>
          
          <div className="relative">
            <button className="p-3 bg-slate-50 dark:bg-slate-900 hover:bg-gold/10 rounded-2xl text-slate-500 transition-all relative">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
          </div>

          <div className="w-px h-8 bg-slate-100 dark:bg-slate-800 mx-2 hidden sm:block"></div>
          
          <ProfileDropdown />
          
          <button 
            onClick={onMenuClick}
            className="p-3 bg-gold/10 hover:bg-gold/20 rounded-2xl text-gold transition-all lg:hidden"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

// --- Pages ---

const Dashboard = () => {
  const navigate = useNavigate();

  const kpiCards = [
    { label: 'Net Cash Position', value: '$125,421.75', change: '+5.2%', icon: Wallet, color: 'gold', trend: 'up', detail: 'Across all business accounts' },
    { label: 'Projected Revenue', value: '$845,000.00', change: '+12.1%', icon: TrendingUp, color: 'blue', trend: 'up', detail: 'Based on current pipeline' },
    { label: 'Monthly Burn Rate', value: '$38,278.75', change: '-1.4%', icon: Activity, color: 'red', trend: 'down', detail: 'Optimized by 4% this month' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Dynamic Header Section */}
      <div className="bg-slate-900 dark:bg-slate-950 p-10 pb-40 transition-all duration-500 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full -mr-48 -mt-48 blur-[100px]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">System Online</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                Good morning, <span className="text-gold">John</span>
              </h1>
              <p className="text-slate-400 mt-4 text-lg font-medium max-w-xl leading-relaxed">
                Your business is performing well. We've identified some key areas for optimization this week.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center gap-3"
            >
              <button 
                onClick={() => navigate('/summary')}
                className="w-full sm:w-auto px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-semibold text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <FileText size={18} />
                View Report
              </button>
              <button 
                onClick={() => navigate('/transactions/add')} 
                className="w-full sm:w-auto bg-gold text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-gold-dark hover:text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold/20"
              >
                <PlusCircle size={20} />
                Add Transaction
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Overlapping Header */}
      <div className="max-w-7xl mx-auto w-full px-6 md:px-10 -mt-32 space-y-12 pb-24 relative z-20">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {kpiCards.map((kpi, i) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (i * 0.1), duration: 0.6 }}
                className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 transition-all group hover:border-gold/30 relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-all duration-500 group-hover:scale-110",
                    kpi.color === 'gold' ? "bg-gold/10 text-gold" :
                    kpi.color === 'blue' ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" :
                    "bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400"
                  )}>
                    <kpi.icon size={24} />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{kpi.detail}</p>
                  </div>
                </div>
                
                <div className="relative z-10">
                  <h4 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{kpi.value}</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={cn(
                      "flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold",
                      kpi.trend === 'up' ? "bg-green-50 dark:bg-green-900/20 text-green-600" : "bg-red-50 dark:bg-red-900/20 text-red-600"
                    )}>
                      {kpi.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {kpi.change}
                    </div>
                    <span className="text-[10px] font-medium text-slate-400">vs last month</span>
                  </div>
                </div>
              </motion.div>
          ))}
        </div>

        {/* Charts & Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 group hover:border-gold/20 transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
                  <span className="text-[10px] font-bold text-gold uppercase tracking-widest">Revenue Analysis</span>
                </div>
                <h3 className="font-bold text-2xl text-slate-800 dark:text-white tracking-tight">Financial Overview</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Comparison of revenue and operating expenses</p>
              </div>
              <div className="flex gap-1 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-100 dark:border-white/5">
                <button className="px-4 py-2 bg-white dark:bg-slate-900 rounded-lg text-xs font-bold text-gold shadow-sm transition-all">Weekly</button>
                <button className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-gold transition-all uppercase tracking-widest">Monthly</button>
              </div>
            </div>
            <div className="h-[400px]">
              <RevenueExpenseChart />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 group hover:border-gold/20 transition-all relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-10 relative z-10">
              <h3 className="font-bold text-2xl text-slate-800 dark:text-white tracking-tight">Expense Mix</h3>
              <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-gold border border-slate-100 dark:border-white/5">
                <LucidePieChart size={20} />
              </div>
            </div>
            
            <div className="h-[300px] flex flex-col items-center justify-center relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Rent', value: 61 },
                      { name: 'Food', value: 22 },
                      { name: 'Utilities', value: 8 },
                      { name: 'Transport', value: 6 },
                      { name: 'Other', value: 3 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {[0, 1, 2, 3, 4].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#D4AF37', '#3B82F6', '#10B981', '#F43F5E', '#64748B'][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                      borderRadius: '12px', 
                      border: '1px solid rgba(212, 175, 55, 0.2)', 
                      padding: '12px',
                      backdropFilter: 'blur(8px)',
                      color: '#fff'
                    }}
                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">61%</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Rent</p>
              </div>
            </div>

            <div className="mt-8 space-y-4 relative z-10">
              {[
                { name: 'Rent', val: 61, color: '#D4AF37' },
                { name: 'Food', val: 22, color: '#3B82F6' },
                { name: 'Utilities', val: 8, color: '#10B981' },
                { name: 'Transport', val: 6, color: '#F43F5E' },
              ].map(item => (
                <div key={item.name} className="flex items-center justify-between group/item cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover/item:text-gold transition-colors">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-white">{item.val}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* AI Insight Section - Elevated */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="bg-slate-900 dark:bg-slate-950 p-10 rounded-2xl shadow-xl text-white relative overflow-hidden group border border-gold/20"
        >
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full -mr-48 -mt-48 blur-[100px]"></div>
          
          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-12">
            <div className="max-w-4xl">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 bg-gold/10 rounded-xl flex items-center justify-center text-gold border border-gold/20 relative">
                  <Zap size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gold tracking-tight">AI Strategic Insight</h3>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Predictive Analysis</p>
                </div>
              </div>
              <p className="text-2xl md:text-3xl text-slate-200 leading-tight font-medium tracking-tight">
                Your <span className="text-white font-bold border-b-2 border-gold pb-1">Profit Margin</span> increased by 12% this month. We've identified a 15% reduction in <span className="text-white font-bold">Operating Costs</span>. 
              </p>
              <div className="mt-8 p-8 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gold"></div>
                <p className="text-lg text-slate-300 italic leading-relaxed font-medium">
                  "Recommendation: Reallocate $2,500 of savings into your top marketing channel. This is projected to maintain growth with a 4.2x expected ROI."
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 min-w-[280px]">
              <button className="w-full px-8 py-4 bg-gold text-slate-900 rounded-xl font-bold text-lg hover:bg-gold-dark hover:text-white transition-all flex items-center justify-center gap-3 shadow-lg shadow-gold/20">
                Execute Strategy <ChevronRight size={20} />
              </button>
              <button className="w-full px-8 py-4 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 border border-white/10">
                Dismiss
              </button>
            </div>
          </div>
        </motion.div>

        {/* Activity & Roadmap */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5"
          >
            <div className="flex items-center justify-between mb-10">
              <h3 className="font-bold text-2xl text-slate-800 dark:text-white tracking-tight">Recent Activity</h3>
              <button onClick={() => navigate('/transactions')} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-[10px] font-bold text-gold uppercase tracking-widest hover:bg-gold hover:text-slate-900 transition-all">View All</button>
            </div>
            <div className="space-y-2">
              {recentTransactions.slice(0, 4).map((t, i) => (
                <div key={t.id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all group border border-transparent hover:border-gold/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-all">
                      {t.icon}
                    </div>
                    <div>
                      <p className="font-bold text-lg text-slate-800 dark:text-white tracking-tight">{t.category}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{t.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "text-xl font-bold tracking-tight",
                      t.amount > 0 ? "text-green-500" : "text-slate-900 dark:text-white"
                    )}>
                      {t.amount > 0 ? `+$${t.amount.toLocaleString()}` : `-$${Math.abs(t.amount).toLocaleString()}`}
                    </p>
                    <div className="flex items-center gap-2 justify-end mt-0.5">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Verified</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-gold p-12 rounded-2xl shadow-2xl shadow-gold/20 flex flex-col justify-between h-full min-h-[400px] group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full -mr-24 -mt-24 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-gold mb-8 shadow-xl">
                  <TrendingUp size={32} />
                </div>
                <h3 className="text-slate-900 font-bold text-3xl tracking-tight leading-tight">Scale your business with confidence.</h3>
                <p className="text-slate-900/70 font-bold mt-6 text-lg leading-relaxed">Our AI models indicate you have sufficient runway to expand your core team by <span className="text-slate-900 font-bold">2 new specialists</span> this quarter.</p>
              </div>
              <button className="relative z-10 mt-10 w-full py-6 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 hover:-translate-y-1 transition-all shadow-2xl active:scale-95">
                Explore Expansion Plan
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};


const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your SME Financial Assistant. I have analyzed your revenue ($765k) and profit ($251k). How can I help you today?' }
  ]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const model = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a financial expert for SMEs. 
        Context: Total Revenue: $765,000, Total Profit: $251,000, Avg Growth: 6.8%, Cash Reserve: $125,000, Burn Rate: $38,000.
        User question: ${input}`,
      });

      const response = await model;
      const aiMsg = { role: 'ai', text: response.text || "I'm sorry, I couldn't process that. Please try again." };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "Error connecting to AI. Please check your API key." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gold/20 flex flex-col overflow-hidden"
          >
            <div className="p-4 bg-gold text-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <MessageSquare size={18} />
                </div>
                <span className="font-bold">AI Financial Advisor</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={cn(
                  "max-w-[80%] p-3 rounded-2xl text-sm",
                  m.role === 'ai' ? "bg-slate-100 text-slate-800 self-start" : "bg-gold text-slate-900 self-end ml-auto"
                )}>
                  {m.text}
                </div>
              ))}
              {isLoading && (
                <div className="bg-slate-100 text-slate-400 p-3 rounded-2xl text-sm self-start animate-pulse">
                  AI is thinking...
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gold/10 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your financials..." 
                className="flex-1 bg-slate-50 border border-gold/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-gold"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="bg-gold p-2 rounded-xl text-slate-900 disabled:opacity-50"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gold rounded-2xl flex items-center justify-center text-slate-900 shadow-xl shadow-gold/30 hover:scale-110 transition-transform active:scale-95"
      >
        <MessageSquare size={28} />
      </button>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center z-[100]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <div className="w-32 h-32 bg-gold/10 rounded-2xl border-2 border-gold flex items-center justify-center shadow-[0_0_50px_rgba(255,215,0,0.2)]">
            <ShieldCheck className="text-gold" size={64} />
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 border border-gold/20 rounded-full border-dashed"
          />
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <h1 className="text-4xl font-bold text-white tracking-widest">SME<span className="text-gold">PULSE</span></h1>
          <p className="text-gold/60 text-sm mt-2 uppercase tracking-[0.3em]">Financial Intelligence</p>
        </motion.div>

        <div className="mt-12 flex gap-4">
          <span className="text-4xl golden-outline-emoji">💰</span>
          <span className="text-4xl golden-outline-emoji">📈</span>
          <span className="text-4xl golden-outline-emoji">💎</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        <main className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          isSidebarOpen ? "lg:pl-72" : "pl-0"
        )}>
          <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} isDark={isDark} toggleDark={() => setIsDark(!isDark)} />
          
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/kpi" element={<KPIExplorer />} />
              <Route path="/profitability" element={<ProfitabilityPage />} />
              <Route path="/cashflow" element={<CashFlowPage />} />
              <Route path="/growth" element={<GrowthTrendsPage />} />
              <Route path="/goalseek" element={<GoalSeekPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/financials" element={<FinancialsPage />} />
              <Route path="/summary" element={<SummaryReportPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/transactions/add" element={<AddTransactionPage />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
          </div>
        </main>

        <Chatbot />
      </div>
    </Router>
  );
}

// --- Placeholder Pages (to be implemented) ---

const SummaryReportPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-gold font-bold text-[10px] uppercase tracking-widest mb-2"
          >
            <Activity size={14} /> Performance Analysis
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Executive Summary</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Performance report for March 2026</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl font-semibold text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm">
            <Share2 size={16} /> Share
          </button>
          <button className="px-5 py-2.5 bg-gold text-slate-900 rounded-xl font-bold text-sm shadow-md hover:bg-gold-dark hover:text-white transition-all flex items-center gap-2">
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Analysis Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 relative overflow-hidden group"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 relative z-10 gap-6">
              <div>
                <h3 className="font-bold text-2xl text-slate-800 dark:text-white tracking-tight">Profitability Analysis</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Comprehensive view of business health</p>
              </div>
              <div className="flex gap-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Net Margin</p>
                  <div className="flex items-center gap-2 justify-end">
                    <TrendingUp size={14} className="text-green-500" />
                    <p className="text-2xl font-bold text-gold">32.4%</p>
                  </div>
                </div>
                <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 self-center"></div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target</p>
                  <p className="text-2xl font-bold text-slate-300 dark:text-slate-600">30.0%</p>
                </div>
              </div>
            </div>
            
            <div className="h-[400px] relative z-10">
              <ProfitabilitySpiderChart />
            </div>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
              {[
                { label: 'Gross Profit', val: '$520k', trend: '+12%' },
                { label: 'Op. Expenses', val: '$269k', trend: '-4%' },
                { label: 'EBITDA', val: '$285k', trend: '+15%' },
                { label: 'Net Income', val: '$251k', trend: '+18%' },
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-white/5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{stat.val}</p>
                  <p className="text-[10px] font-semibold text-green-500 mt-1">{stat.trend} vs LY</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { 
                title: 'Revenue Streams', 
                color: 'bg-gold',
                icon: TrendingUp,
                items: [
                  { label: 'Product Sales', val: 65, growth: '+8%' },
                  { label: 'Services', val: 25, growth: '+12%' },
                  { label: 'Subscriptions', val: 10, growth: '+25%' },
                ]
              },
              { 
                title: 'Expense Breakdown', 
                color: 'bg-slate-800 dark:bg-slate-600',
                icon: TrendingDown,
                items: [
                  { label: 'Payroll', val: 45, growth: '+2%' },
                  { label: 'Marketing', val: 30, growth: '-5%' },
                  { label: 'Operations', val: 25, growth: '+1%' },
                ]
              }
            ].map((section, idx) => (
              <motion.div 
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 group hover:border-gold transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-8">
                  <h4 className="font-bold text-xl text-slate-800 dark:text-white flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", section.color + "/10 text-" + (idx === 0 ? 'gold' : 'slate-400'))}>
                      <section.icon size={20} />
                    </div>
                    {section.title}
                  </h4>
                  <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <ChevronRight size={18} className="text-slate-400" />
                  </button>
                </div>
                <div className="space-y-6">
                  {section.items.map(s => (
                    <div key={s.label} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{s.label}</span>
                          <p className="text-xs font-semibold text-slate-900 dark:text-white">{s.growth} growth</p>
                        </div>
                        <span className="text-base font-bold text-slate-900 dark:text-white">{s.val}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${s.val}%` }}
                          transition={{ duration: 1.2, delay: 0.3 + (idx * 0.2) }}
                          className={cn("h-full rounded-full", section.color)}
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 dark:bg-slate-950 p-8 rounded-2xl shadow-xl text-white border border-gold/20 relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center text-gold">
                  <Zap size={20} />
                </div>
                <h3 className="font-bold text-xl tracking-tight">AI Strategic Insights</h3>
              </div>

              <div className="space-y-6">
                <p className="text-base text-slate-300 leading-relaxed font-medium">
                  Your business is showing <span className="text-white font-bold border-b border-gold">Strong Momentum</span> with a 12.5% revenue increase. 
                </p>
                
                <div className="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
                    <p className="text-[10px] font-bold text-gold uppercase tracking-widest">Recommendation</p>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed italic font-medium">
                    "Focus on reducing operational overhead in Q2 to further boost net margins by an estimated 4.5%. Reallocating 5% of marketing spend to high-ROI channels could yield an additional $40k in revenue."
                  </p>
                </div>

                <div className="pt-8 border-t border-white/10">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-xs font-bold text-gold uppercase tracking-widest">Risk Assessment</p>
                    <span className="text-xs font-bold text-green-500 uppercase tracking-widest">Low Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "h-2.5 flex-1 rounded-full transition-all duration-500",
                          i <= 1 ? "bg-green-500 shadow-lg shadow-green-500/20" : "bg-slate-800"
                        )}
                      ></div>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold mt-3 uppercase tracking-tighter">Based on current market volatility & cash reserves</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-10">
              <h3 className="font-bold text-2xl text-slate-800 dark:text-white tracking-tight">Priority Actions</h3>
              <div className="w-8 h-8 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                <Target size={18} />
              </div>
            </div>
            
            <div className="space-y-8">
              {[
                { text: 'Review Q2 marketing budget', priority: 'High', icon: Zap },
                { text: 'Optimize cloud server costs', priority: 'Medium', icon: Activity },
                { text: 'Follow up on pending invoices', priority: 'High', icon: DollarSign },
                { text: 'Schedule tax consultation', priority: 'Low', icon: ShieldCheck }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ x: 10 }}
                  className="flex items-start gap-5 group cursor-pointer"
                >
                  <div className={cn(
                    "mt-1 w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all duration-300",
                    item.priority === 'High' 
                      ? "border-gold/20 bg-gold/5 text-gold group-hover:bg-gold group-hover:text-slate-900 group-hover:border-gold" 
                      : "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-400 group-hover:border-slate-300"
                  )}>
                    <item.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-gold transition-colors leading-tight">{item.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest",
                        item.priority === 'High' ? "text-gold" : "text-slate-400"
                      )}>{item.priority} Priority</span>
                      <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Due in 3d</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <button className="w-full mt-12 py-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-gold hover:text-slate-900 transition-all uppercase tracking-[0.2em] shadow-sm">
              View Full Strategic Roadmap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NewsPage = () => (
  <div className="p-6 space-y-8">
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Market Intelligence</h1>
      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Live Updates</span>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {newsData.map((news, i) => (
        <motion.div 
          key={news.id} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden group transition-all hover:shadow-2xl hover:-translate-y-1"
        >
          <div className="h-56 overflow-hidden relative">
            <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-[10px] font-bold text-gold uppercase tracking-widest rounded-full shadow-lg">
                {news.domain}
              </span>
            </div>
          </div>
          <div className="p-8">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-2 leading-tight group-hover:text-gold transition-colors">{news.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 line-clamp-3 leading-relaxed">{news.summary}</p>
            
            <div className="mt-8 p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl relative">
              <div className="absolute -top-3 left-4 px-2 bg-white dark:bg-slate-900 text-[10px] font-bold text-gold uppercase tracking-widest">
                AI Strategy
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">"{news.recommendation}"</p>
            </div>
            
            <button className="w-full mt-6 py-3 border border-slate-100 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-gold hover:text-slate-900 hover:border-gold transition-all">
              Read Full Analysis
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const InsightsPage = () => (
  <div className="p-6 space-y-8">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Business Insights</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">AI-powered recommendations for your growth</p>
      </div>
      <div className="flex gap-2 bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
        <button className="p-2 bg-gold text-slate-900 rounded-lg shadow-lg shadow-gold/20"><LayoutDashboard size={20} /></button>
        <button className="p-2 text-slate-400 hover:text-gold transition-colors"><LucidePieChart size={20} /></button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[
        { title: 'Revenue Anomaly', desc: 'April expenses spiked by 15% due to unexpected maintenance.', type: 'warning', icon: Activity, priority: 'High' },
        { title: 'Market Trend', desc: 'SME tax reforms could save you $5k this year.', type: 'success', icon: TrendingUp, priority: 'Medium' },
        { title: 'Cash Flow Forecast', desc: 'Positive cash flow expected for the next 3 months.', type: 'info', icon: Zap, priority: 'Low' },
        { title: 'Operational Efficiency', desc: 'Automation tools could reduce overhead by 10%.', type: 'success', icon: ShieldCheck, priority: 'Medium' },
        { title: 'Growth Potential', desc: 'Expanding to regional markets could boost revenue by 20%.', type: 'info', icon: TrendingUp, priority: 'High' },
        { title: 'Risk Mitigation', desc: 'Diversifying suppliers will reduce supply chain risk.', type: 'warning', icon: ShieldCheck, priority: 'Medium' },
      ].map((insight, i) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="group relative bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 hover:border-gold transition-all duration-500 overflow-hidden"
        >
          <div className={cn(
            "absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-5 transition-transform group-hover:scale-150 duration-700",
            insight.type === 'warning' ? "bg-amber-500" : 
            insight.type === 'success' ? "bg-green-500" : "bg-gold"
          )}></div>

          <div className="flex justify-between items-start mb-10">
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-110",
              insight.type === 'warning' ? "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 shadow-amber-500/10" : 
              insight.type === 'success' ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 shadow-green-500/10" : "bg-gold/10 text-gold shadow-gold/10"
            )}>
              <insight.icon size={32} />
            </div>
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border",
              insight.priority === 'High' ? "border-red-200 text-red-500 bg-red-50 dark:bg-red-900/20" :
              insight.priority === 'Medium' ? "border-amber-200 text-amber-500 bg-amber-50 dark:bg-amber-900/20" :
              "border-blue-200 text-blue-500 bg-blue-50 dark:bg-blue-900/20"
            )}>
              {insight.priority} Priority
            </span>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white leading-tight">{insight.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-base">{insight.desc}</p>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
            <button className="text-gold font-bold text-sm flex items-center gap-2 group/btn">
              Take Action 
              <ChevronRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
            </button>
            <div className="flex -space-x-2">
              {[1, 2].map(j => (
                <div key={j} className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800"></div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const KPIExplorer = () => (
    <div className="p-8 space-y-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
            <span className="text-[10px] font-bold text-gold uppercase tracking-widest">Metric Analysis</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">KPI Explorer</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium max-w-2xl">Deep-dive into the core performance indicators driving your business growth.</p>
        </div>
        <div className="flex gap-2 bg-slate-50 dark:bg-slate-900 p-1 rounded-xl border border-slate-100 dark:border-white/5">
          <button className="px-6 py-2 bg-white dark:bg-slate-800 rounded-lg text-xs font-bold text-gold shadow-sm">Real-time</button>
          <button className="px-6 py-2 text-xs font-bold text-slate-400 hover:text-gold transition-all uppercase tracking-widest">Historical</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5"
        >
          <div className="flex items-center justify-between mb-10">
            <h3 className="font-bold text-2xl text-slate-800 dark:text-white tracking-tight">Revenue Growth Trend</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gold rounded-full"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target</span>
              </div>
            </div>
          </div>
          <div className="h-[400px]">
            <GrowthTrendChart />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-4">
          {[
            { label: 'Burn Rate', value: '$38,278', change: '-4.2%', icon: Activity, detail: 'Monthly average' },
            { label: 'Runway', value: '14.5 Mo', change: '+2.1%', icon: Zap, detail: 'Projected stability' },
            { label: 'CAC', value: '$120.50', change: '-12%', icon: User, detail: 'Acquisition cost' },
            { label: 'LTV', value: '$2,450', change: '+8.5%', icon: DollarSign, detail: 'Lifetime value' },
          ].map((kpi, i) => (
            <motion.div 
              key={kpi.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 border-l-4 border-l-gold group hover:translate-x-1 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                  <kpi.icon size={20} />
                </div>
                <span className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-widest",
                  kpi.change.startsWith('+') ? "bg-green-50 dark:bg-green-900/20 text-green-600" : "bg-red-50 dark:bg-red-900/20 text-red-600"
                )}>
                  {kpi.change}
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5 tracking-tight">{kpi.value}</p>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">{kpi.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
);

const ProfitabilityPage = () => (
    <div className="p-8 space-y-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
            <span className="text-[10px] font-bold text-gold uppercase tracking-widest">Efficiency Audit</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Profitability</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium max-w-2xl">Visualizing the operational efficiency and margin health of your enterprise.</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl shadow-sm border border-slate-100 dark:border-white/5">
          <Calendar size={18} className="text-gold" />
          <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">FY 2026 Analysis</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5"
        >
          <div className="flex items-center justify-between mb-10">
            <h3 className="font-bold text-2xl text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
              <LucidePieChart size={24} className="text-gold" /> Performance Radar
            </h3>
            <div className="px-4 py-1.5 bg-gold/10 rounded-full text-[10px] font-bold text-gold uppercase tracking-widest border border-gold/20">
              Multi-Dimensional Analysis
            </div>
          </div>
          <div className="h-[450px]">
            <ProfitabilitySpiderChart />
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 dark:bg-slate-950 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden group border border-gold/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold border border-gold/20">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-gold tracking-tight">AI Audit</h3>
            </div>
            <p className="text-lg text-slate-300 leading-relaxed font-medium">
              Your <span className="text-white font-bold border-b border-gold">Efficiency Rating</span> is at 85%, outperforming industry benchmarks.
            </p>
            <div className="mt-6 p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
              <p className="text-[10px] font-bold text-gold uppercase tracking-widest mb-2">Strategic Pivot</p>
              <p className="text-sm text-slate-400 leading-relaxed">Infrastructure is optimized for scale. Reallocating <span className="text-white font-bold">12% of OpEx</span> to R&D could unlock new revenue streams.</p>
            </div>
          </motion.div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">
            <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-6 tracking-tight">Margin Health</h3>
            <div className="space-y-4">
              {[
                { label: 'Gross Margin', value: '68.4%', change: '+2.4%', icon: TrendingUp },
                { label: 'Net Margin', value: '32.1%', change: '+1.8%', icon: TrendingUp },
                { label: 'Op. Efficiency', value: '85.0%', change: '+5.0%', icon: Zap },
              ].map((metric, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-white/5 group hover:border-gold/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center text-gold">
                      <metric.icon size={20} />
                    </div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{metric.label}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{metric.value}</p>
                    <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">{metric.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
);

const CashFlowPage = () => (
    <div className="p-8 space-y-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
            <span className="text-[10px] font-bold text-gold uppercase tracking-widest">Liquidity Analysis</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Cash Flow</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium max-w-2xl">Monitoring the pulse of your business liquidity and capital reserves.</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl shadow-sm border border-slate-100 dark:border-white/5">
          <Filter size={18} className="text-gold" />
          <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Monthly Pulse</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5"
        >
          <div className="flex items-center justify-between mb-10">
            <h3 className="font-bold text-2xl text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
              <Activity size={24} className="text-gold" /> Stability Index
            </h3>
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-gold rounded-full"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          </div>
          <div className="h-[450px]">
            <CashFlowChart />
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 dark:bg-slate-950 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden group border border-gold/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold border border-gold/20">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-gold tracking-tight">Liquidity AI</h3>
            </div>
            <p className="text-lg text-slate-300 leading-relaxed font-medium">
              Your <span className="text-white font-bold border-b border-gold">Cash Reserve</span> is projected to expand by <span className="text-white font-bold">$15,400</span> next cycle.
            </p>
            <div className="mt-6 p-6 bg-red-500/10 rounded-xl border border-red-500/20 backdrop-blur-md">
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-2">Liquidity Alert</p>
              <p className="text-sm text-slate-400 leading-relaxed">Identified <span className="text-white font-bold">$4.2k in stagnant receivables</span>. Follow-up will improve liquidity ratio by 8%.</p>
            </div>
          </motion.div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">
            <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-8 tracking-tight">Liquidity Ratios</h3>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-3">
                  <span className="text-slate-500">Current Ratio</span>
                  <span className="text-slate-900 dark:text-white">2.4 / Optimal</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '80%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gold"
                  ></motion.div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-3">
                  <span className="text-slate-500">Quick Ratio</span>
                  <span className="text-slate-900 dark:text-white">1.8 / Stable</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '60%' }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    className="h-full bg-blue-500"
                  ></motion.div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-50 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 font-medium italic text-center">Ratios based on GAAP standards for SMEs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
);

const GrowthTrendsPage = () => (
  <div className="p-8 space-y-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
            <span className="text-[10px] font-bold text-gold uppercase tracking-widest">Trajectory Analysis</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Growth Trends</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium max-w-2xl">Analyzing the long-term velocity and expansion patterns of your business.</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl shadow-sm border border-slate-100 dark:border-white/5">
          <TrendingUp size={18} className="text-gold" />
          <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Yearly Velocity</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5"
        >
          <div className="flex items-center justify-between mb-10">
            <h3 className="font-bold text-2xl text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
              <BarChart3 size={24} className="text-gold" /> Year-over-Year Velocity
            </h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gold rounded-full"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Market Avg</span>
              </div>
            </div>
          </div>
          <div className="h-[400px]">
            <GrowthTrendChart />
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 dark:bg-slate-950 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden group border border-gold/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold border border-gold/20">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-gold tracking-tight">Growth AI</h3>
            </div>
            <p className="text-lg text-slate-300 leading-relaxed font-medium">
              Your <span className="text-white font-bold border-b border-gold">Expansion Velocity</span> is currently at 1.4x the regional average for SMEs.
            </p>
            <div className="mt-6 p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
              <p className="text-[10px] font-bold text-gold uppercase tracking-widest mb-2">Market Opportunity</p>
              <p className="text-sm text-slate-400 leading-relaxed">Current momentum suggests a <span className="text-white font-bold">22% growth potential</span> in adjacent markets by Q3.</p>
            </div>
          </motion.div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">
            <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-6 tracking-tight">Growth Drivers</h3>
            <div className="space-y-4">
              {[
                { label: 'Market Share', value: '12.5%', change: '+1.2%', icon: TrendingUp },
                { label: 'Customer Base', value: '1.2k', change: '+15%', icon: UserPlus },
                { label: 'Brand Equity', value: '8.4/10', change: '+0.5', icon: ShieldCheck },
              ].map((metric, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-white/5 group hover:border-gold/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center text-gold">
                      <metric.icon size={20} />
                    </div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{metric.label}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{metric.value}</p>
                    <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">{metric.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
);

const GoalSeekPage = () => (
  <div className="p-8 space-y-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
            <span className="text-[10px] font-bold text-gold uppercase tracking-widest">Predictive Modeling</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Goal Seek</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium max-w-2xl">Simulate financial scenarios and visualize the impact of strategic adjustments.</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl shadow-sm border border-slate-100 dark:border-white/5">
          <Zap size={18} className="text-gold" />
          <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Live Simulation</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">
            <h3 className="font-bold text-2xl text-slate-800 dark:text-white mb-10 tracking-tight">Scenario Parameters</h3>
            <div className="space-y-10">
              {[
                { label: 'Revenue Growth', unit: '%', default: 15, color: 'accent-gold' },
                { label: 'Operational Efficiency', unit: '%', default: 8, color: 'accent-blue-500' },
                { label: 'Customer Acquisition', unit: 'qty', default: 120, color: 'accent-green-500' },
              ].map(param => (
                <div key={param.label} className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-base font-bold text-slate-700 dark:text-slate-300 tracking-tight">{param.label}</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gold tracking-tight">+{param.default}{param.unit}</span>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Projected Increase</p>
                    </div>
                  </div>
                  <input 
                    type="range" 
                    className={cn("w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 appearance-none cursor-pointer", param.color)} 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gold p-8 rounded-2xl shadow-xl text-slate-900 relative overflow-hidden group"
          >
            <p className="text-[10px] font-bold text-slate-900/60 uppercase tracking-widest mb-3">Projected Impact</p>
            <h2 className="text-5xl font-bold tracking-tight mb-2">+$42,500</h2>
            <p className="text-base font-bold text-slate-900/80 leading-tight">Estimated increase in <span className="border-b border-slate-900/20">Net Quarterly Profit</span> based on simulation.</p>
            
            <div className="mt-8 pt-8 border-t border-slate-900/10">
              <button className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-all">Apply Strategy</button>
            </div>
          </motion.div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">
            <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-4 tracking-tight">Sensitivity Analysis</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Your profit is most sensitive to <span className="text-gold font-bold">Revenue Growth</span>. A 1% change impacts net profit by approximately <span className="text-slate-900 dark:text-white font-bold">$2,800</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
);

const ComparePage = () => (
  <div className="p-8 space-y-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
            <span className="text-[10px] font-bold text-gold uppercase tracking-widest">Market Positioning</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Benchmarking</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium max-w-2xl">Compare your performance metrics against industry leaders and regional averages.</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl shadow-sm border border-slate-100 dark:border-white/5">
          <Globe size={18} className="text-gold" />
          <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Industry: Tech SME</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5"
        >
          <h3 className="font-bold text-2xl text-slate-800 dark:text-white mb-10 tracking-tight">Performance vs Industry Average</h3>
          <div className="space-y-10">
            {[
              { label: 'Net Margin', you: 32, industry: 28, unit: '%' },
              { label: 'Growth Rate', you: 12, industry: 15, unit: '%' },
              { label: 'Efficiency', you: 85, industry: 70, unit: '%' },
              { label: 'Customer Retention', you: 92, industry: 88, unit: '%' },
            ].map(stat => (
              <div key={stat.label} className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-base font-bold text-slate-700 dark:text-slate-300 tracking-tight">{stat.label}</span>
                  <div className="flex gap-6">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gold uppercase tracking-widest">Your Score</p>
                      <span className="text-xl font-bold text-gold tracking-tight">{stat.you}{stat.unit}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Industry</p>
                      <span className="text-xl font-bold text-slate-400 tracking-tight">{stat.industry}{stat.unit}</span>
                    </div>
                  </div>
                </div>
                <div className="relative h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.you}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute top-0 left-0 h-full bg-gold z-10"
                  ></motion.div>
                  <div 
                    className="absolute top-0 left-0 h-full bg-slate-300 dark:bg-slate-700 opacity-30" 
                    style={{ width: `${stat.industry}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="space-y-6">
          <div className="bg-slate-900 dark:bg-slate-950 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden group border border-gold/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold border border-gold/20">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-gold tracking-tight">Competitive AI</h3>
            </div>
            <p className="text-lg text-slate-300 leading-relaxed font-medium">
              You are currently in the <span className="text-white font-bold border-b border-gold">Top 15%</span> of Tech SMEs in your region.
            </p>
            <div className="mt-6 p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
              <p className="text-[10px] font-bold text-gold uppercase tracking-widest mb-2">Competitive Edge</p>
              <p className="text-sm text-slate-400 leading-relaxed">Your <span className="text-white font-bold">Operational Efficiency</span> is your primary differentiator. Leverage this in your next pitch.</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">
            <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-6 tracking-tight">Industry Trends</h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Market Shift</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Industry-wide CAC is rising by 14% YoY. Your current optimization is a major asset.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Benchmark Alert</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Average retention in Tech SMEs has dropped to 82%. Your 92% is world-class.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
);

const FinancialsPage = () => (
  <div className="p-6 space-y-8">
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Financial Statements</h1>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-all flex items-center gap-2">
          <Download size={16} /> Export PDF
        </button>
        <button className="px-4 py-2 bg-gold text-slate-900 rounded-xl text-sm font-bold hover:bg-gold-light transition-all shadow-lg shadow-gold/20">
          Print Report
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {[
        { 
          title: 'Profit & Loss', 
          icon: TrendingUp,
          items: [
            { label: 'Total Revenue', value: '$765,000', type: 'positive' },
            { label: 'Cost of Goods Sold', value: '$245,000', type: 'negative' },
            { label: 'Gross Profit', value: '$520,000', type: 'total' },
            { label: 'Operating Expenses', value: '$269,000', type: 'negative' },
            { label: 'Net Income', value: '$251,000', type: 'final' },
          ]
        },
        { 
          title: 'Balance Sheet', 
          icon: Scale,
          items: [
            { label: 'Total Assets', value: '$1,250,000', type: 'positive' },
            { label: 'Total Liabilities', value: '$450,000', type: 'negative' },
            { label: 'Total Equity', value: '$800,000', type: 'total' },
            { label: 'Current Ratio', value: '2.4', type: 'info' },
            { label: 'Debt to Equity', value: '0.56', type: 'info' },
          ]
        },
        { 
          title: 'Cash Flow', 
          icon: Activity,
          items: [
            { label: 'Operating Cash Flow', value: '$285,000', type: 'positive' },
            { label: 'Investing Cash Flow', value: '-$120,000', type: 'negative' },
            { label: 'Financing Cash Flow', value: '-$40,000', type: 'negative' },
            { label: 'Net Cash Flow', value: '$125,000', type: 'final' },
            { label: 'Ending Cash Balance', value: '$310,000', type: 'total' },
          ]
        },
      ].map((statement, i) => (
        <motion.div
          key={statement.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold">
              <statement.icon size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">{statement.title}</h3>
          </div>
          <div className="space-y-6">
            {statement.items.map((item, j) => (
              <div key={j} className={cn(
                "flex justify-between items-center py-2",
                item.type === 'total' && "border-t border-slate-100 dark:border-slate-800 pt-4 font-bold",
                item.type === 'final' && "border-t-2 border-gold/20 pt-4 font-bold text-lg"
              )}>
                <span className="text-sm text-slate-500 dark:text-slate-400">{item.label}</span>
                <span className={cn(
                  "font-bold",
                  item.type === 'negative' ? "text-red-500" : 
                  item.type === 'positive' ? "text-green-500" :
                  item.type === 'final' ? "text-gold" : "text-slate-900 dark:text-white"
                )}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const TransactionsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-10 space-y-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-gold rounded-full"></div>
            <span className="text-[10px] font-bold text-gold uppercase tracking-[0.3em]">Financial Ledger</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tighter">Transactions</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 text-xl font-medium max-w-2xl">A comprehensive record of your business capital flow and expenditure.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl font-bold text-xs uppercase tracking-widest border border-red-100 dark:border-red-900/30 hover:bg-red-100 transition-all shadow-sm">
            - Record Expense
          </button>
          <button className="px-6 py-3 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-2xl font-bold text-xs uppercase tracking-widest border border-green-100 dark:border-green-900/30 hover:bg-green-100 transition-all shadow-sm">
            + Record Income
          </button>
          <button 
            onClick={() => navigate('/transactions/add')} 
            className="bg-gold text-slate-900 px-8 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-gold/20 hover:bg-gold-light hover:-translate-y-1 transition-all flex items-center gap-2"
          >
            <PlusCircle size={20} /> Add Entry
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <Filter size={16} className="text-gold" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Filter</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <Calendar size={16} className="text-gold" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">March 2026</span>
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Showing 5 of 124 transactions</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 dark:border-slate-800">
                <th className="p-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date & Time</th>
                <th className="p-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category & Description</th>
                <th className="p-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="p-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="p-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {[
                { date: 'Mar 24', time: '14:30', cat: 'Office Supplies', desc: 'Ergonomic chairs for new hires', amount: '-$450.00', icon: Briefcase, type: 'expense' },
                { date: 'Mar 23', time: '09:15', cat: 'Client Payment', desc: 'Q1 Consulting - TechCorp', amount: '+$2,500.00', icon: TrendingUp, type: 'income' },
                { date: 'Mar 22', time: '11:45', cat: 'Software Sub', desc: 'Cloud Infrastructure Monthly', amount: '-$120.00', icon: Zap, type: 'expense' },
                { date: 'Mar 21', time: '16:20', cat: 'Consulting', desc: 'Strategic Workshop Fee', amount: '+$1,200.00', icon: ShieldCheck, type: 'income' },
                { date: 'Mar 20', time: '10:00', cat: 'Utility Bills', desc: 'Electricity & Internet', amount: '-$300.00', icon: Activity, type: 'expense' },
              ].map((t, i) => (
                <motion.tr 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                >
                  <td className="p-8">
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{t.date}, 2026</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t.time}</p>
                  </td>
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110",
                        t.type === 'income' ? "bg-green-100 dark:bg-green-900/20 text-green-600" : "bg-gold/10 text-gold"
                      )}>
                        <t.icon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-gold transition-colors">{t.cat}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{t.desc}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <p className={cn(
                      "text-lg font-bold tracking-tighter",
                      t.type === 'income' ? "text-green-500" : "text-slate-900 dark:text-white"
                    )}>{t.amount}</p>
                  </td>
                  <td className="p-8">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Verified</span>
                    </div>
                  </td>
                  <td className="p-8 text-right">
                    <button className="p-3 hover:bg-white dark:hover:bg-slate-900 rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                      <ChevronRight size={18} className="text-slate-400" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-8 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-50 dark:border-slate-800 flex justify-center">
          <button className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] hover:text-gold transition-colors">Load More Transactions</button>
        </div>
      </div>
    </div>
  );
};

const AddTransactionPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => navigate('/transactions'), 2000);
    }, 1500);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <button 
          onClick={() => navigate('/transactions')} 
          className="p-3 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl text-slate-500 shadow-sm border border-slate-100 dark:border-slate-800 transition-all"
        >
          <ChevronRight size={24} className="rotate-180" />
        </button>
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">New Transaction</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Record your business financials with precision</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Transaction Amount</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold group-focus-within:bg-gold group-focus-within:text-slate-900 transition-all">
                    <DollarSign size={20} />
                  </div>
                  <input 
                    required
                    type="number" 
                    step="0.01"
                    placeholder="0.00"
                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl pl-16 pr-6 py-5 outline-none focus:border-gold dark:focus:border-gold transition-all text-xl font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Type of Entry</label>
                <div className="relative">
                  <select className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-5 outline-none focus:border-gold dark:focus:border-gold transition-all appearance-none font-bold text-slate-800 dark:text-slate-200">
                    <option value="expense">Expense Entry</option>
                    <option value="income">Income Entry</option>
                  </select>
                  <ChevronRight size={20} className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Business Category</label>
              <div className="relative">
                <select className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-5 outline-none focus:border-gold dark:focus:border-gold transition-all appearance-none font-bold text-slate-800 dark:text-slate-200">
                  <option>Office Supplies & Equipment</option>
                  <option>Marketing & Advertising</option>
                  <option>Payroll & Benefits</option>
                  <option>Software & Subscriptions</option>
                  <option>Professional Consulting</option>
                  <option>Utilities & Rent</option>
                  <option>Inventory & COGS</option>
                  <option>Travel & Meals</option>
                  <option>Other Business Expense</option>
                </select>
                <ChevronRight size={20} className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Description & Notes</label>
              <textarea 
                rows={4}
                placeholder="Provide context for this transaction..."
                className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-5 outline-none focus:border-gold dark:focus:border-gold transition-all resize-none font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-700"
              />
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gold text-slate-900 py-6 rounded-2xl text-xl font-bold flex items-center justify-center gap-4 shadow-2xl shadow-gold/20 hover:bg-gold-light hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0"
              >
                {isSubmitting ? (
                  <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 size={24} />
                    Finalize Transaction
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                <FileText size={20} />
              </div>
              <h3 className="font-bold text-xl text-slate-800 dark:text-white tracking-tight">Documentation</h3>
            </div>
            
            <div className="space-y-6">
              <div className="relative group">
                <input 
                  type="file" 
                  multiple
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center group-hover:border-gold/50 group-hover:bg-gold/5 transition-all duration-300">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400 group-hover:text-gold group-hover:scale-110 transition-all">
                    <Upload size={32} />
                  </div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Upload Receipt</p>
                  <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest">PDF, JPG, PNG up to 10MB</p>
                </div>
              </div>

              {files.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Attached Files ({files.length})</p>
                  {files.map((file, i) => (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={i} 
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center text-gold">
                          <FileText size={16} />
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">{file.name}</span>
                      </div>
                      <button type="button" onClick={() => removeFile(i)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          <div className="bg-slate-900 dark:bg-slate-950 p-8 rounded-2xl shadow-2xl text-white border border-gold/20 relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gold/10 rounded-full blur-3xl"></div>
            <h4 className="font-bold text-lg text-gold mb-4 flex items-center gap-2">
              <ShieldCheck size={20} /> AI Compliance Check
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              Our AI will automatically scan your uploaded receipts for tax compliance and categorize them for optimal reporting.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Ready</span>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-6"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 p-12 rounded-2xl shadow-2xl text-center border border-gold/30 max-w-sm w-full"
            >
              <div className="w-24 h-24 bg-gold rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-gold/40">
                <CheckCircle2 className="text-slate-900" size={48} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Success!</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium">Your transaction has been securely recorded.</p>
              <div className="mt-10 w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2 }}
                  className="h-full bg-gold"
                />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Redirecting...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GoalsPage = () => (
  <div className="p-6 space-y-8">
    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Goal Tracking</h1>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 border-l-8 border-l-gold">
        <h3 className="text-gold font-bold uppercase tracking-widest text-xs">Daily Wisdom</h3>
        <p className="text-2xl font-serif italic text-slate-800 dark:text-slate-200 mt-4 leading-relaxed">
          "Financial freedom is available to those who learn about it and work for it."
        </p>
        <div className="mt-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold">
            <Target size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-white">Current Focus</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Increase net margin by 2% this quarter.</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {[
          { label: 'Revenue Target', progress: 75, target: '$1M' },
          { label: 'Expense Limit', progress: 40, target: '$400k' },
          { label: 'Growth Goal', progress: 60, target: '10%' },
        ].map(goal => (
          <div key={goal.label} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">{goal.label}</span>
              <span className="text-xs font-bold text-gold">{goal.progress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${goal.progress}%` }}
                className="h-full bg-gold shadow-[0_0_10px_rgba(255,215,0,0.5)]"
              />
            </div>
            <p className="text-right text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">Target: {goal.target}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const LoginPage = () => (
  <div className="min-h-[80vh] flex items-center justify-center p-6 relative overflow-hidden">
    {/* Finance Animations */}
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: '110vh', x: Math.random() * 100 + 'vw', opacity: 0 }}
          animate={{ 
            y: '-10vh', 
            opacity: [0, 1, 1, 0],
            rotate: 360 
          }}
          transition={{ 
            duration: Math.random() * 5 + 5, 
            repeat: Infinity, 
            delay: Math.random() * 5 
          }}
          className="absolute text-gold/20"
        >
          <Coins size={Math.random() * 20 + 20} />
        </motion.div>
      ))}
    </div>

    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden"
    >
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gold/10 rounded-full blur-3xl"></div>
      
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-gold/30 mb-6">
          <ShieldCheck className="text-slate-900" size={32} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Securely access your business pulse.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Email Address</label>
          <input type="email" placeholder="john@example.com" className="w-full bg-slate-50 dark:bg-slate-950 border border-gold/10 rounded-xl px-4 py-3 outline-none focus:border-gold transition-colors dark:text-white" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Password</label>
          <input type="password" placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-950 border border-gold/10 rounded-xl px-4 py-3 outline-none focus:border-gold transition-colors dark:text-white" />
        </div>
        <button className="w-full btn-gold py-4 text-lg">Sign In</button>
      </div>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
        Don't have an account? <Link to="/signup" className="text-gold font-bold">Create one</Link>
      </p>
    </motion.div>
  </div>
);

const SignupPage = () => (
  <div className="min-h-[80vh] flex items-center justify-center p-6 relative overflow-hidden">
    {/* Finance Animations */}
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: '110vh', x: Math.random() * 100 + 'vw', opacity: 0 }}
          animate={{ 
            y: '-10vh', 
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 1, 0.5]
          }}
          transition={{ 
            duration: Math.random() * 5 + 5, 
            repeat: Infinity, 
            delay: Math.random() * 5 
          }}
          className="absolute text-gold/10"
        >
          <Wallet size={Math.random() * 20 + 20} />
        </motion.div>
      ))}
    </div>

    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800"
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Join SMEPulse</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Start your journey to financial clarity.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Business Name</label>
          <input type="text" placeholder="Acme Corp" className="w-full bg-slate-50 dark:bg-slate-950 border border-gold/10 rounded-xl px-4 py-3 outline-none focus:border-gold transition-colors dark:text-white" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Work Email</label>
          <input type="email" placeholder="ceo@acme.com" className="w-full bg-slate-50 dark:bg-slate-950 border border-gold/10 rounded-xl px-4 py-3 outline-none focus:border-gold transition-colors dark:text-white" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Password</label>
          <input type="password" placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-950 border border-gold/10 rounded-xl px-4 py-3 outline-none focus:border-gold transition-colors dark:text-white" />
        </div>
        <button className="w-full btn-gold py-4 text-lg">Create Account</button>
      </div>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
        Already have an account? <Link to="/login" className="text-gold font-bold">Sign in</Link>
      </p>
    </motion.div>
  </div>
);
