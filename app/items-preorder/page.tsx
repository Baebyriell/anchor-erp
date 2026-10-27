'use client';
import React from 'react';
import EditableTable from '../../components/EditableTable';
import { useSheet, SaveIndicator } from '../../hooks/useSheet';

export default function PreOrderCatalog() {
  const { rows, headers, update, updateHeaders, status } = useSheet<Record<string, any>>(
    'items_preorder',
    [
      {
        'Item Name': 'Luxury Mesh Sneakers',
        'Platform Source': '1688.com',
        'Item Link': 'https://1688.com',
        'Item Specifications': 'Breathable, sport sole',
        'Available Sizes': '39, 40, 41, 42, 43',
        'Estimated Weight (kg)': '0.85',
        'Item Information': 'High demand for coming season'
      },
      {
        'Item Name': 'Foldable LED Ring Light',
        'Platform Source': 'Taobao',
        'Item Link': 'https://taobao.com',
        'Item Specifications': '3 light modes, USB plug',
        'Available Sizes': '10 inch, 12 inch',
        'Estimated Weight (kg)': '1.40',
        'Item Information': 'Verify bundle parameters with supplier'
      }
    ],
    [
      'Item Name',
      'Platform Source',
      'Item Link',
      'Item Specifications',
      'Available Sizes',
      'Estimated Weight (kg)',
      'Item Information'
    ]
  );

  // Save changes instantly when you update any data cell
  const handleRowsUpdate = (updatedRows: Record<string, any>[]) => {
    update(updatedRows);
  };

  const handleHeadersUpdate = (updatedHeaders: string[]) => {
    updateHeaders(updatedHeaders);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-mono">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Block */}
        <header className="border-b border-slate-800 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-amber-400 tracking-tight flex items-center gap-2">
              📦 Page 2: Pre-Order Product Catalog
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Log item profiles, weights, specs, and overseas sourcing configurations cleanly.
            </p>
          </div>
          <span className="text-[11px] bg-amber-500/10 text-amber-400 font-bold px-3 py-1 rounded-md border border-amber-500/20">
            Catalog Items: {rows.length}
          </span>
        </header>

        {/* Tip Box */}
        <div className="bg-slate-900/40 border border-slate-800 p-3 rounded-lg text-xs text-slate-400">
          💡 <span className="text-slate-200 font-bold">Vibe Coder Tip:</span> Use this page strictly to define your raw inventory data. Your separated pricing conversion matrix handles your financial math smoothly.
        </div>

        {/* Dynamic Spreadsheet Engine View */}
        <div className="flex justify-end"><SaveIndicator status={status} /></div>

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
