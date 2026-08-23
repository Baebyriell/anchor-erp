'use client';
import React, { useState, useEffect } from 'react';
import EditableTable from '../../components/EditableTable';

export default function SalesLedger() {
  const [headers, setHeaders] = useState([
    'Item Name',
    'Who Purchased',
    'Specifications (Color/Size)',
    'Quantity',
    'Unit Price (GHS)',
    'Total Cost (GHS)',
    'Status'
  ]);

  const [rows, setRows] = useState<Record<string, any>[]>([]);

  // Automatically fetch historical daily sales transactions from cache
  useEffect(() => {
    const saved = localStorage.getItem('erp_sales_ledger_v2');
    if (saved) {
      setRows(JSON.parse(saved));
    } else {
      // Default sample logs showing active transactions vs a sorted delivered row
      setRows([
        {
          'Item Name': 'Stainless Steel Water Flask',
          'Who Purchased': 'Ama Serwaa',
          'Specifications (Color/Size)': 'Matte Black / 500ml',
          'Quantity': '2',
          'Unit Price (GHS)': '150.00',
          'Total Cost (GHS)': '300.00',
          'Status': 'Shipping Fee Pending'
        },
        {
          'Item Name': 'Wireless Bluetooth Earbuds',
          'Who Purchased': 'Kofi Mensah',
          'Specifications (Color/Size)': 'White / One Size',
          'Quantity': '1',
          'Unit Price (GHS)': '104.00',
          'Total Cost (GHS)': '104.00',
          'Status': 'Delivered' // This will naturally sit lower down the table array
        }
      ]);
    }
  }, []);

  // Intercept row updates to run dynamic quantity multiplication math
  const handleRowsUpdate = (updatedRows: Record<string, any>[]) => {
    const autoCalculatedRows = updatedRows.map(row => {
      const newRow = { ...row };
      const qty = parseInt(newRow['Quantity'] || '0');
      const unitPrice = parseFloat(newRow['Unit Price (GHS)'] || '0');

      if (!isNaN(qty) && !isNaN(unitPrice)) {
        newRow['Total Cost (GHS)'] = (qty * unitPrice).toFixed(2);
      }
      return newRow;
    });

    setRows(autoCalculatedRows);
    localStorage.setItem('erp_sales_ledger_v2', JSON.stringify(autoCalculatedRows));
  };

  const handleHeadersUpdate = (updatedHeaders: string[]) => {
    setHeaders(updatedHeaders);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-mono">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Summary Section */}
        <header className="border-b border-slate-800 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-purple-400 tracking-tight flex items-center gap-2">
              🧾 Page 7: Available Ready Goods Sales Ledger
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Log client retail transactions and manage item payment statuses instantly.
            </p>
          </div>
          <span className="text-[11px] bg-purple-500/10 text-purple-400 font-bold px-3 py-1 rounded-md border border-purple-500/20">
            Total Orders: {rows.length}
          </span>
        </header>

        {/* Dynamic Workflow Alert Notice */}
        <div className="bg-slate-900/40 border border-slate-800 p-3 rounded-lg text-xs text-slate-400 space-y-1">
          <div>
            💡 <span className="text-slate-200 font-bold">Auto-Recalculate:</span> Editing <span className="text-amber-400">Quantity</span> or <span className="text-amber-400">Unit Price</span> will dynamically compute the <span className="text-emerald-400">Total Cost</span> column.
          </div>
          <div>
            ⚡ <span className="text-amber-400 font-bold">UX Rule Active:</span> Typing or selecting <span className="text-slate-100 font-bold">"delivered"</span> inside the Status cell will automatically sort that row to the absolute bottom of your spreadsheet interface.
          </div>
        </div>

        {/* Central Core Editable Table View */}
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
