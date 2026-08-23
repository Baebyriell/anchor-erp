'use client';
import React, { useState, useEffect } from 'react';
import EditableTable from '../../components/EditableTable';

export default function CustomerSummaryMatrix() {
  const [headers, setHeaders] = useState([
    'Customer Name',
    'All Items Purchased',
    'Individual Prices Breakdown',
    'Total Accumulated Bill (GHS)',
    'Global Account Status'
  ]);

  const [rows, setRows] = useState<Record<string, any>[]>([]);

  // Aggregate and load relational data from browser memory caches
  useEffect(() => {
    const savedMatrix = localStorage.getItem('erp_customer_matrix_v2');
    
    if (savedMatrix) {
      setRows(JSON.parse(savedMatrix));
    } else {
      // Fetch data streams from Sales Ledger and Pre-Order logs if available
      const rawSales = localStorage.getItem('erp_sales_ledger_v2');
      const salesData = rawSales ? JSON.parse(rawSales) : [];

      // Simulated compilation of grouped customer data logs
      setRows([
        {
          'Customer Name': 'Ama Serwaa',
          'All Items Purchased': 'Stainless Steel Water Flask, Luxury Mesh Sneakers',
          'Individual Prices Breakdown': '150.00, 212.50',
          'Total Accumulated Bill (GHS)': '362.50',
          'Global Account Status': 'Awaiting Arrival'
        },
        {
          'Customer Name': 'Kofi Mensah',
          'All Items Purchased': 'Wireless Bluetooth Earbuds',
          'Individual Prices Breakdown': '104.00',
          'Total Accumulated Bill (GHS)': '104.00',
          'Global Account Status': 'Delivered' // Sorted to bottom automatically
        }
      ]);
    }
  }, []);

  // Recalculate automatic variables if user adjustments happen inside columns
  const handleRowsUpdate = (updatedRows: Record<string, any>[]) => {
    const recalculatedRows = updatedRows.map(row => {
      const newRow = { ...row };
      const breakdownStr = String(newRow['Individual Prices Breakdown'] || '0');
      
      // Split the list of numbers by commas and add them together automatically
      const cleanSum = breakdownStr
        .split(',')
        .map(val => parseFloat(val.trim()))
        .filter(val => !isNaN(val))
        .reduce((sum, val) => sum + val, 0);

      newRow['Total Accumulated Bill (GHS)'] = cleanSum.toFixed(2);
      return newRow;
    });

    setRows(recalculatedRows);
    localStorage.setItem('erp_customer_matrix_v2', JSON.stringify(recalculatedRows));
  };

  const handleHeadersUpdate = (updatedHeaders: string[]) => {
    setHeaders(updatedHeaders);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-mono">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Metadata Section */}
        <header className="border-b border-slate-800 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-rose-400 tracking-tight flex items-center gap-2">
              📊 Page 8: Customer Lifetime Summary Matrix
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Cross-reference client profiles to audit item lists and total lifetime balances due.
            </p>
          </div>
          <span className="text-[11px] bg-rose-500/10 text-rose-400 font-bold px-3 py-1 rounded-md border border-rose-500/20">
            Accounts: {rows.length}
          </span>
        </header>

        {/* Dynamic Help Card */}
        <div className="bg-slate-900/40 border border-slate-800 p-3 rounded-lg text-xs text-slate-400">
          💡 <span className="text-slate-200 font-bold">Comma-Separated Pricing Engine:</span> When typing in individual prices inside the <span className="text-amber-400">Individual Prices Breakdown</span> cell (e.g. <span className="text-slate-300 font-bold">150, 200, 45</span>), the spreadsheet automatically calculates the total sum in GHS for you instantly!
        </div>

        {/* Live Sorting Table Engine Container */}
        <EditableTable
          headers={headers}
          rows={rows}
          onUpdateHeaders={handleHeadersUpdate}
          onUpdateRows={handleRowsUpdate}
          statusColumnName="Global Account Status"
        />
        
      </div>
    </div>
  );
}
