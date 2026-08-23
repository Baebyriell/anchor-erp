'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MasterDashboard() {
  // Available Metrics Cache
  const [readySalesCount, setReadySalesCount] = useState(0);
  const [readyRevenue, setReadyRevenue] = useState(0);
  
  // Pre-Order Metrics Cache
  const [preorderCount, setPreorderCount] = useState(0);
  const [preorderRevenue, setPreorderRevenue] = useState(0);

  // CRM Metrics Cache
  const [customerCount, setCustomerCount] = useState(0);

  useEffect(() => {
    // 1. Pull Available Goods ledger metrics
    const rawSales = localStorage.getItem('erp_sales_ledger_v2');
    if (rawSales) {
      const sales = JSON.parse(rawSales);
      setReadySalesCount(sales.length);
      const total = sales.reduce((sum: number, item: any) => sum + (parseFloat(item['Total Cost (GHS)']) || 0), 0);
      setReadyRevenue(total);
    } else {
      setReadySalesCount(2);
      setReadyRevenue(404.00); // Default template fallback base
    }

    // 2. Pull Pre-Order logs ledger metrics
    const rawPreorders = localStorage.getItem('erp_preorder_by_item_v2');
    if (rawPreorders) {
      const preorders = JSON.parse(rawPreorders);
      setPreorderCount(preorders.length);
      const total = preorders.reduce((sum: number, item: any) => sum + (parseFloat(item['Calculated Total Cost (GHS)']) || 0), 0);
      setPreorderRevenue(total);
    } else {
      setPreorderCount(2);
      setPreorderRevenue(752.50);
    }

    // 3. Pull Customer CRM counts
    const rawCustomers = localStorage.getItem('erp_customers_v2');
    if (rawCustomers) {
      setCustomerCount(JSON.parse(rawCustomers).length);
    } else {
      setCustomerCount(2);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-mono">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Hub Header */}
        <header className="border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-black text-amber-400 tracking-tight">⚓ ANCHOR CORE ERP v1.0</h1>
          <p className="text-xs text-slate-500 mt-1">
            China-to-Ghana Pre-Order Pipeline Engine & Local Ready Stock Management Suite
          </p>
        </header>

        {/* Modular Navigation Shortcuts Grid Panel */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/items-preorder" className="bg-slate-900 border border-slate-800 hover:border-amber-500 p-3 rounded-xl transition text-center text-xs font-bold text-amber-400">
            📦 Pre-Order Catalog
          </Link>
          <Link href="/pricing-preorder" className="bg-slate-900 border border-slate-800 hover:border-emerald-500 p-3 rounded-xl transition text-center text-xs font-bold text-emerald-400">
            💰 Pre-Order Pricing
          </Link>
          <Link href="/items-available" className="bg-slate-900 border border-slate-800 hover:border-indigo-500 p-3 rounded-xl transition text-center text-xs font-bold text-indigo-400">
            🛍️ Ready Inventory
          </Link>
          <Link href="/customers" className="bg-slate-900 border border-slate-800 hover:border-blue-500 p-3 rounded-xl transition text-center text-xs font-bold text-blue-400">
            👥 Customer CRM
          </Link>
        </section>

        {/* Isolated Financial Performance Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* PANEL A: Available Ready Stock Analytics */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 bg-indigo-500/10 text-indigo-400 font-bold text-[10px] px-3 py-1 rounded-bl-xl border-l border-b border-slate-800/40 uppercase">
              Available Inventory
            </div>
            <h2 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">🛍️ Ready-Stock Sales Summary</h2>
            
            <div className="space-y-4">
              <div>
                <span className="text-[11px] text-slate-500 block uppercase font-bold tracking-wider">Total Realized Revenue</span>
                <span className="text-3xl font-black text-indigo-400">GH₵{readyRevenue.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-800/60 pt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">INVOICES LOGGED</span>
                  <span className="font-bold text-slate-300">{readySalesCount} Orders</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">FULFILLMENT CHANNEL</span>
                  <span className="font-bold text-emerald-400">Instant Local</span>
                </div>
              </div>
              <Link href="/sales-ledger" className="block text-center bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold py-2 rounded-lg transition mt-2">
                Open Daily Sales Ledger ➔
              </Link>
            </div>
          </section>

          {/* PANEL B: Pre-Order Operations Analytics */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 bg-amber-500/10 text-amber-400 font-bold text-[10px] px-3 py-1 rounded-bl-xl border-l border-b border-slate-800/40 uppercase">
              Pre-Order Pipeline
            </div>
            <h2 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">📦 Pre-Order Capital Summary</h2>
            
            <div className="space-y-4">
              <div>
                <span className="text-[11px] text-slate-500 block uppercase font-bold tracking-wider">Total Pipeline Value</span>
                <span className="text-3xl font-black text-amber-400">GH₵{preorderRevenue.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-800/60 pt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">ACTIVE SHIPMENTS</span>
                  <span className="font-bold text-slate-300">{preorderCount} Packages</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">CRM CONNECTIONS</span>
                  <span className="font-bold text-blue-400">{customerCount} Clients active</span>
                </div>
              </div>
              <Link href="/preorder-by-item" className="block text-center bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold py-2 rounded-lg transition mt-2">
                Open Supply Chain Pipeline ➔
              </Link>
            </div>
          </section>

        </div>

        {/* Global Overview Section */}
        <section className="bg-slate-900/30 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-slate-400 gap-4">
          <div>
            🔒 <span className="text-slate-200 font-bold">Local-First Storage Matrix Mode:</span> Your ledger logs are fully compiled locally within this terminal session cache for enhanced user data privacy.
          </div>
          <div className="text-slate-500 whitespace-nowrap text-right">
            System Status: <span className="text-emerald-400 font-bold">● Active Operational</span>
          </div>
        </section>

      </div>
    </div>
  );
}
