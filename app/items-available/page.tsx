'use client';
import React, { useState, useEffect } from 'react';
import EditableTable from '../../components/EditableTable';

export default function AvailableGoodsCatalog() {
  const [headers, setHeaders] = useState([
    'Item Name',
    'Item Link',
    'Item Specifications',
    'Available Sizes / Colors',
    'Active Stock Quantity',
    'Unit Weight (kg)',
    'Storage Location Notes'
  ]);

  const [rows, setRows] = useState<Record<string, any>[]>([]);

  // Automatically load saved on-hand stock from your browser cache
  useEffect(() => {
    const saved = localStorage.getItem('erp_items_available_v2');
    if (saved) {
      setRows(JSON.parse(saved));
    } else {
      // Default placeholder ready-stock items to initialize your sheet layout
      setRows([
        {
          'Item Name': 'Stainless Steel Water Flask',
          'Item Link': 'https://1688.com',
          'Item Specifications': 'Double-walled vacuum insulated, Matte black',
          'Available Sizes / Colors': '500ml / Black, Silver',
          'Active Stock Quantity': '25',
          'Unit Weight (kg)': '0.35',
          'Storage Location Notes': 'Box A under the display desk'
        },
        {
          'Item Name': 'Wireless Bluetooth Earbuds',
          'Item Link': 'https://taobao.com',
          'Item Specifications': 'Noise cancelling, Type-C charging case',
          'Available Sizes / Colors': 'One Size / White',
          'Active Stock Quantity': '14',
          'Unit Weight (kg)': '0.12',
          'Storage Location Notes': 'Top shelf locking cabinet'
        }
      ]);
    }
  }, []);

  // Save changes automatically into browser memory whenever you edit a cell
  const handleRowsUpdate = (updatedRows: Record<string, any>[]) => {
    setRows(updatedRows);
    localStorage.setItem('erp_items_available_v2', JSON.stringify(updatedRows));
  };

  const handleHeadersUpdate = (updatedHeaders: string[]) => {
    setHeaders(updatedHeaders);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-mono">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Block */}
        <header className="border-b border-slate-800 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-indigo-400 tracking-tight flex items-center gap-2">
              🛍️ Page 3: Available Ready Goods Catalog
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Monitor active quantities and configurations for inventory physically on hand in Ghana.
            </p>
          </div>
          <span className="text-[11px] bg-indigo-500/10 text-indigo-400 font-bold px-3 py-1 rounded-md border border-indigo-500/20">
            Unique Products: {rows.length}
          </span>
        </header>

        {/* Tip Box */}
        <div className="bg-slate-900/40 border border-slate-800 p-3 rounded-lg text-xs text-slate-400">
          💡 <span className="text-slate-200 font-bold">Vibe Coder Tip:</span> This sheet isolates items ready for immediate local sales. Keep an eye on "Active Stock Quantity" so you never over-sell your physical stock!
        </div>

        {/* Reusable Spreadsheet Component View */}
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
