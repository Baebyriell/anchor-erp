'use client';
import React, { useState, useEffect } from 'react';
import EditableTable from '../../components/EditableTable';

export default function PreorderByItemTracker() {
  const [headers, setHeaders] = useState([
    'Item Name',
    'Who Purchased',
    'Item Specifications (Color/Size)',
    'Order Quantity',
    'Unit Selling Price (GHS)',
    'Calculated Total Cost (GHS)',
    'Logistics Step Status'
  ]);

  const [rows, setRows] = useState<Record<string, any>[]>([]);

  // Instantly read saved item pipelines from local cache memory
  useEffect(() => {
    const saved = localStorage.getItem('erp_preorder_by_item_v2');
    if (saved) {
      setRows(JSON.parse(saved));
    } else {
      // Default sample items tracking your granular Chinese workflow milestones
      setRows([
        {
          'Item Name': 'Luxury Mesh Sneakers',
          'Who Purchased': 'Ama Serwaa',
          'Item Specifications (Color/Size)': 'Pink / Size 40',
          'Order Quantity': '1',
          'Unit Selling Price (GHS)': '212.50',
          'Calculated Total Cost (GHS)': '212.50',
          'Logistics Step Status': 'Shipped (12 days left)'
        },
        {
          'Item Name': 'Foldable LED Ring Light',
          'Who Purchased': 'Abena Osei',
          'Item Specifications (Color/Size)': 'Warm Light / 12 inch',
          'Order Quantity': '3',
          'Unit Selling Price (GHS)': '180.00',
          'Calculated Total Cost (GHS)': '540.00',
          'Logistics Step Status': 'In Warehouse'
        }
      ]);
    }
  }, []);

  // Run auto-multiplication calculations before storing the changes
  const handleRowsUpdate = (updatedRows: Record<string, any>[]) => {
    const matrixCalculatedRows = updatedRows.map(row => {
      const newRow = { ...row };
      const qty = parseInt(newRow['Order Quantity'] || '0');
      const price = parseFloat(newRow['Unit Selling Price (GHS)'] || '0');

      if (!isNaN(qty) && !isNaN(price)) {
        newRow['Calculated Total Cost (GHS)'] = (qty * price).toFixed(2);
      }
      return newRow;
    });

    setRows(matrixCalculatedRows);
    localStorage.setItem('erp_preorder_by_item_v2', JSON.stringify(matrixCalculatedRows));
  };

  const handleHeadersUpdate = (updatedHeaders: string[]) => {
    setHeaders(updatedHeaders);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-mono">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Main Tracker Header Panel */}
        <header className="border-b border-slate-800 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-amber-400 tracking-tight flex items-center gap-2">
              📦 Page 9: Pre-Order Tracker By Item Name
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Group client shipments by item type to streamline bulk sourcing requests from 1688 and Taobao.
            </p>
          </div>
          <span className="text-[11px] bg-amber-500/10 text-amber-400 font-bold px-3 py-1 rounded-md border border-amber-500/20">
            Active Packages: {rows.length}
          </span>
        </header>

        {/* Workflow Guide Info Block */}
        <div className="bg-slate-900/40 border border-slate-800 p-3 rounded-lg text-xs text-slate-400 space-y-1">
          <div>
            📝 <span className="text-slate-200 font-bold">Logistics Tip:</span> Keep track of your supplier updates here. You can write your specific workflow stage like <span className="text-slate-100 font-bold">"sourcing"</span>, <span className="text-slate-100 font-bold">"in warehouse"</span>, or <span className="text-slate-100 font-bold">"cleared"</span>.
          </div>
          <div>
            ⚡ <span className="text-emerald-400 font-bold">Auto-Sorting:</span> Changing the status field to <span className="text-emerald-400 font-bold">"delivered"</span> pushes that package down to the end of the list automatically.
          </div>
        </div>

        {/* The Operational Supply Table Sheet View */}
        <EditableTable
          headers={headers}
          rows={rows}
          onUpdateHeaders={handleHeadersUpdate}
          onUpdateRows={handleRowsUpdate}
          statusColumnName="Logistics Step Status"
        />
        
      </div>
    </div>
  );
}
