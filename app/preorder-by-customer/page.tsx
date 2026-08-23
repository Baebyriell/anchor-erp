'use client';
import React, { useState, useEffect } from 'react';
import EditableTable from '../../components/EditableTable';

export default function PreorderByCustomerTracker() {
  const [headers, setHeaders] = useState([
    'Customer Name',
    'Items Ordered (Pre-orders)',
    'Specifications Allocated',
    'Total Pre-order Cost (GHS)',
    'Customer Pre-order Status'
  ]);

  const [rows, setRows] = useState<Record<string, any>[]>([]);

  // Automatically fetch customer package arrays from local browser cache storage
  useEffect(() => {
    const saved = localStorage.getItem('erp_preorder_by_customer_v2');
    if (saved) {
      setRows(JSON.parse(saved));
    } else {
      // Default sample logs showing customer pre-order group statuses
      setRows([
        {
          'Customer Name': 'Ama Serwaa',
          'Items Ordered (Pre-orders)': 'Luxury Mesh Sneakers',
          'Specifications Allocated': 'Pink / Size 40',
          'Total Pre-order Cost (GHS)': '212.50',
          'Customer Pre-order Status': 'Shipped (12 days left)'
        },
        {
          'Customer Name': 'Abena Osei',
          'Items Ordered (Pre-orders)': 'Foldable LED Ring Light (x3)',
          'Specifications Allocated': 'Warm Light / 12 inch',
          'Total Pre-order Cost (GHS)': '540.00',
          'Customer Pre-order Status': 'Packed & Ready to Ship'
        }
      ]);
    }
  }, []);

  // Sync changes instantly into browser local memory when cells are updated inline
  const handleRowsUpdate = (updatedRows: Record<string, any>[]) => {
    setRows(updatedRows);
    localStorage.setItem('erp_preorder_by_customer_v2', JSON.stringify(updatedRows));
  };

  const handleHeadersUpdate = (updatedHeaders: string[]) => {
    setHeaders(updatedHeaders);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-mono">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Main Dashboard Header */}
        <header className="border-b border-slate-800 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-blue-400 tracking-tight flex items-center gap-2">
              📦 Page 10: Pre-Order Tracker By Customer Name
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Audit arrival groupings by unique customer name to speed up sorting and domestic courier parcel packing.
            </p>
          </div>
          <span className="text-[11px] bg-blue-500/10 text-blue-400 font-bold px-3 py-1 rounded-md border border-blue-500/20">
            Active Accounts: {rows.length}
          </span>
        </header>

        {/* Tip Informative block */}
        <div className="bg-slate-900/40 border border-slate-800 p-3 rounded-lg text-xs text-slate-400">
          💡 <span className="text-slate-200 font-bold">Accra Arrival Hub Tip:</span> When cargo boxes clear customs in Ghana, search the names here to quickly bundle multi-item client orders together. Toggle the status cell to <span className="text-emerald-400 font-bold">"delivered"</span> to clear fulfilled profiles down to the bottom.
        </div>

        {/* Core Spreadsheet Component Integration */}
        <EditableTable
          headers={headers}
          rows={rows}
          onUpdateHeaders={handleHeadersUpdate}
          onUpdateRows={handleRowsUpdate}
          statusColumnName="Customer Pre-order Status"
        />
        
      </div>
    </div>
  );
}
