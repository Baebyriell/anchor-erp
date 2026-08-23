'use client';
import React, { useState, useEffect } from 'react';

interface PricingRow {
  id: string;
  name: string;
  rmbPrice: number;
  chinaDeliveryRmb: number;
  profitPercentage: number;
  weightKg: number;
  agent: 'vuoman' | 'aquantuo';
}

export default function PreOrderPricingEngine() {
  const [rows, setRows] = useState<PricingRow[]>([]);
  
  // Custom Input Forms
  const [name, setName] = useState('');
  const [rmbPrice, setRmbPrice] = useState('');
  const [chinaDeliveryRmb, setChinaDeliveryRmb] = useState('');
  const [profitPercentage, setProfitPercentage] = useState(20);
  const [weightKg, setWeightKg] = useState('');
  const [agent, setAgent] = useState<'vuoman' | 'aquantuo'>('vuoman');

  // Strict 2026 Conversion Metrics
  const RMB_TO_GHS = 1.65;
  const USD_TO_GHS = 15.90;
  const AGENT_RATES = { vuoman: 10.50, aquantuo: 14.00 };

  useEffect(() => {
    const saved = localStorage.getItem('erp_pricing_preorder_v2');
    if (saved) {
      setRows(JSON.parse(saved));
    } else {
      setRows([
        {
          id: '1',
          name: 'Luxury Mesh Sneakers',
          rmbPrice: 85,
          chinaDeliveryRmb: 10,
          profitPercentage: 25,
          weightKg: 0.85,
          agent: 'vuoman'
        },
        {
          id: '2',
          name: 'Foldable LED Ring Light',
          rmbPrice: 120,
          chinaDeliveryRmb: 0,
          profitPercentage: 20,
          weightKg: 1.40,
          agent: 'aquantuo'
        }
      ]);
    }
  }, []);

  const saveRows = (updatedRows: PricingRow[]) => {
    setRows(updatedRows);
    localStorage.setItem('erp_pricing_preorder_v2', JSON.stringify(updatedRows));
  };

  const handleAddCalculatedRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !rmbPrice) return;

    const newRow: PricingRow = {
      id: Date.now().toString(),
      name,
      rmbPrice: parseFloat(rmbPrice),
      chinaDeliveryRmb: parseFloat(chinaDeliveryRmb || '0'),
      profitPercentage: profitPercentage,
      weightKg: parseFloat(weightKg || '0'),
      agent
    };

    saveRows([newRow, ...rows]);
    setName(''); setRmbPrice(''); setChinaDeliveryRmb(''); setWeightKg('');
  };

  const deleteRow = (id: string) => {
    saveRows(rows.filter(r => r.id !== id));
  };

  // Math Pipeline Calculations Engine
  const calculateFinalGhs = (row: PricingRow) => {
    // 1. Total cost landed at China warehouse
    const totalChinaRmb = row.rmbPrice + row.chinaDeliveryRmb;
    const baseCostGhs = totalChinaRmb * RMB_TO_GHS;

    // 2. Air Cargo Freight breakdown to Accra
    const rateUsdPerKg = AGENT_RATES[row.agent];
    const shippingCostGhs = row.weightKg * rateUsdPerKg * USD_TO_GHS;

    // 3. Combined production expenses
    const landedCostGhs = baseCostGhs + shippingCostGhs;

    // 4. Inject profit margin multiplier
    const markupMultiplier = 1 + (row.profitPercentage / 100);
    const finalSellingPriceGhs = landedCostGhs * markupMultiplier;

    return {
      landed: landedCostGhs.toFixed(2),
      shipping: shippingCostGhs.toFixed(2),
      final: finalSellingPriceGhs.toFixed(2)
    };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-mono">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Summary Tab */}
        <header className="border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-black text-emerald-400 tracking-tight flex items-center gap-2">
            💰 Page 4: Pre-Order Sourcing & Pricing Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Calculate automated final Cedi selling prices using direct live shipping agent parameter multipliers.
          </p>
        </header>

        {/* Dynamic Interactive Input Calc Calculator Panel */}
        <section className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-xl">
          <h2 className="text-sm font-bold text-slate-200 mb-3 uppercase tracking-wider">🎯 Quick Pricing Generator</h2>
          <form onSubmit={handleAddCalculatedRow} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input type="text" placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-emerald-500 text-slate-200" required />
            <input type="number" step="0.01" placeholder="Base Price (RMB ¥)" value={rmbPrice} onChange={e => setRmbPrice(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-emerald-500 text-slate-200" required />
            <input type="number" step="0.01" placeholder="China Warehouse Delivery (RMB ¥)" value={chinaDeliveryRmb} onChange={e => setChinaDeliveryRmb(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-emerald-500 text-slate-200" />
            
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-1.5 rounded-lg text-xs">
              <span className="text-slate-500 font-bold px-1">MARKUP:</span>
              <select value={profitPercentage} onChange={e => setProfitPercentage(parseInt(e.target.value))} className="bg-slate-900 border border-slate-800 rounded p-1 text-slate-200 flex-1">
                <option value={10}>10% Profit Margin</option>
                <option value={15}>15% Profit Margin</option>
                <option value={20}>20% Profit Margin</option>
                <option value={25}>25% Profit Margin</option>
                <option value={30}>30% Profit Margin</option>
              </select>
            </div>

            <input type="number" step="0.01" placeholder="Weight (kg)" value={weightKg} onChange={e => setWeightKg(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-emerald-500 text-slate-200" />
            
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-1.5 rounded-lg text-xs">
              <span className="text-slate-500 font-bold px-1">CARGO:</span>
              <select value={agent} onChange={e => setAgent(e.target.value as any)} className="bg-slate-900 border border-slate-800 rounded p-1 text-slate-200 flex-1">
                <option value="vuoman">Vuoman ($10.50/kg)</option>
                <option value="aquantuo">Aquantuo ($14.00/kg)</option>
              </select>
            </div>

            <button type="submit" className="md:col-span-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-lg text-xs transition uppercase tracking-wider">
              Calculate & Add to Financial Ledger
            </button>
          </form>
        </section>

        {/* Display Live Calculated Pricing Board Spreadsheet */}
        <div className="overflow-x-auto border border-slate-800 rounded-lg">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-amber-400">
                <th className="p-3">Product Name</th>
                <th className="p-3">Base Cost (RMB)</th>
                <th className="p-3">China Deliv (RMB)</th>
                <th className="p-3">Margin</th>
                <th className="p-3">Freight Config</th>
                <th className="p-3 text-slate-400">Est Shipping</th>
                <th className="p-3 text-emerald-400">Final Price (GHS)</th>
                <th className="p-3 text-center text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-slate-600 italic">No products added. Generate custom metrics above.</td>
                </tr>
              ) : (
                rows.map(row => {
                  const math = calculateFinalGhs(row);
                  return (
                    <tr key={row.id} className="border-b border-slate-900 bg-slate-900/20 hover:bg-slate-900/60 transition text-slate-200">
                      <td className="p-3 font-bold">{row.name}</td>
                      <td className="p-3">¥{row.rmbPrice.toFixed(2)}</td>
                      <td className="p-3">¥{row.chinaDeliveryRmb.toFixed(2)}</td>
                      <td className="p-3 text-blue-400 font-bold">{row.profitPercentage}%</td>
                      <td className="p-3 capitalize text-slate-400">{row.agent} ({row.weightKg}kg)</td>
                      <td className="p-3 text-slate-400">GH₵{math.shipping}</td>
                      <td className="p-3 text-emerald-400 font-black text-sm">GH₵{math.final}</td>
                      <td className="p-3 text-center">
                        <button onClick={() => deleteRow(row.id)} className="text-rose-400 hover:text-rose-300 font-bold text-xs">✕</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
