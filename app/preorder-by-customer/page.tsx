'use client';
import React from 'react';
import EditableTable from '../../components/EditableTable';
import { useSheet, SaveIndicator } from '../../hooks/useSheet';

export default function PreorderByCustomerTracker() {
  const { rows, headers, update, updateHeaders, status } = useSheet<Record<string, any>>(
    'preorder_by_customer',
    [
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
    ],
    [
      'Customer Name',
      'Items Ordered (Pre-orders)',
      'Specifications Allocated',
      'Total Pre-order Cost (GHS)',
      'Customer Pre-order Status'
    ]
  );

  // Sync changes to the server when cells are updated inline
  const handleRowsUpdate = (updatedRows: Record<string, any>[]) => {
    update(updatedRows);
  };

  const handleHeadersUpdate = (updatedHeaders: string[]) => {
    updateHeaders(updatedHeaders);
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
        <div className="flex justify-end"><SaveIndicator status={status} /></div>

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
