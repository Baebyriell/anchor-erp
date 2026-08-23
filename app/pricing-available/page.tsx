'use client';
import React, { useState, useEffect } from 'react';
import EditableTable from '../../components/EditableTable';

export default function AvailableGoodsPricing() {
  const [headers, setHeaders] = useState([
    'Item Name',
    'Total Landed Cost (GHS)',
    'Target Profit Margin',
    'Calculated Profit (GHS)',
    'Final Retail Selling Price (GHS)',
    'Min. Wholesale Price (GHS)',
    'Pricing Strategy Notes'
  ]);

  const [rows, setRows] = useState<Record<string, any>[]>([]);

  // Automatically load saved pricing arrays from browser cache
  useEffect(() => {
    const saved = localStorage.getItem('erp_pricing_available_v2');
    if (saved) {
      setRows(JSON.parse(saved));
    } else {
      // Default sample logs showing how the markup engine computes selling prices
      setRows([
        {
          'Item Name': 'Stainless Steel Water Flask',
          'Total Landed Cost (GHS)': '120.00',
          'Target Profit Margin': '25%',
          'Calculated Profit (GHS)': '30.00',
          'Final Retail Selling Price (GHS)': '150.00',
          'Min. Wholesale Price (GHS)': '135.00',
          'Pricing Strategy Notes': 'Matches local retail market averages'
        },
        {
          'Item Name': 'Wireless Bluetooth Earbuds',
          'Total Landed Cost (GHS)': '80.00',
          'Target Profit Margin': '30%',
          'Calculated Profit (GHS)': '24.00',
          'Final Retail Selling Price (GHS)': '104.00',
          'Min. Wholesale Price (GHS)': '90.00',
          'Pricing Strategy Notes': 'Include free shipping code promo if buying 2+'
        }
      ]);
    }
  }, []);

  // Intercept data updates to auto-run cell math before writing to storage
  const handleRowsUpdate = (updatedRows: Record<string, any>[]) => {
    const calculatedRows = updatedRows.map(row => {
      const newRow = { ...row };
      const landed = parseFloat(newRow['Total Landed Cost (GHS)'] || '0');
      const marginStr = String(newRow['Target Profit Margin'] || '0');
      
      // Sanitize the percentage sign if typed (e.g., "25%" -> 25)
      const marginPercent = parseFloat(marginStr.replace('%', '')) || 0;

      if (!isNaN(landed) && marginPercent > 0) {
        const profit = landed * (marginPercent / 100);
        const finalPrice = landed + profit;

        newRow['Calculated Profit (GHS)'] = profit.toFixed(2);
        newRow['Final Retail Selling Price (GHS)'] = finalPrice.toFixed(2);
      }
      return newRow;
    });

    setRows(calculatedRows);
    localStorage.setItem('erp_pricing_available_v2', JSON.stringify(calculatedRows));
  };

  const handleHeadersUpdate = (updatedHeaders: string[]) => {
    setHeaders(updatedHeaders);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-mono">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header Grid */}
        <header className="border-b border-slate-800 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-blue-400 tracking-tight flex items-center gap-2">
              🏷️ Page 5: Available Goods Pricing Sheet
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage profit margins and calculate final Cedi retail prices for ready-to-sell stock on hand.
            </p>
          </div>
          <span className="text-[11px] bg-blue-500/10 text-blue-400 font-bold px-3 py-1 rounded-md border border-blue-500/20">
            Active SKUs: {rows.length}
          </span>
        </header>

        {/* Tip Helper Section */}
        <div className="bg-slate-900/40 border border-slate-800 p-3 rounded-lg text-xs text-slate-400">
          💡 <span className="text-slate-200 font-bold">Smart Auto-Math Engine:</span> When you edit the <span className="text-amber-400">Total Landed Cost</span> or <span className="text-amber-400">Target Profit Margin (e.g. 25%)</span> cell inputs, the app automatically calculates the profit and final retail price in GHS instantly!
        </div>

        {/* Core Spreadsheet Visual Canvas */}
        <EditableTable
          headers={headers}
          rows={rows}
          onUpdateHeaders={handleHeadersUpdate}
          onUpdateRows={handleRowsUpdate}
        />
        
      </div>
    </div>
  );
}
