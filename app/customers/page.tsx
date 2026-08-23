'use client';
import React, { useState, useEffect } from 'react';
import EditableTable from '../../components/EditableTable';

export default function CustomerCRM() {
  const [headers, setHeaders] = useState([
    'Full Name',
    'Phone Number',
    'WhatsApp Link',
    'Email Address',
    'Drop-off Location',
    'Internal Side Notes'
  ]);

  const [rows, setRows] = useState<Record<string, any>[]>([]);

  // Automatically load saved customers from your browser for free
  useEffect(() => {
    const saved = localStorage.getItem('erp_customers_v2');
    if (saved) {
      setRows(JSON.parse(saved));
    } else {
      // Default placeholder rows so your sheet isn't empty at start
      setRows([
        {
          'Full Name': 'Ama Serwaa',
          'Phone Number': '0551234567',
          'WhatsApp Link': 'wa.me/233551234567',
          'Email Address': 'ama@gmail.com',
          'Drop-off Location': 'Accra Mall Pick-up',
          'Internal Side Notes': 'Prefers air shipping only'
        },
        {
          'Full Name': 'Kofi Mensah',
          'Phone Number': '0249876543',
          'WhatsApp Link': 'wa.me/233249876543',
          'Email Address': 'kofi@yahoo.com',
          'Drop-off Location': 'Kumasi VIP Station',
          'Internal Side Notes': 'Always orders preorders'
        }
      ]);
    }
  }, []);

  // Save updates instantly whenever you type anything into a cell
  const handleRowsUpdate = (updatedRows: Record<string, any>[]) => {
    setRows(updatedRows);
    localStorage.setItem('erp_customers_v2', JSON.stringify(updatedRows));
  };

  const handleHeadersUpdate = (updatedHeaders: string[]) => {
    setHeaders(updatedHeaders);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-mono">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <header className="border-b border-slate-800 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-blue-400 tracking-tight flex items-center gap-2">
              👥 Page 6: Customer CRM Master File
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Organize your entire customer database network safely inside your browser.
            </p>
          </div>
          <span className="text-[11px] bg-blue-500/10 text-blue-400 font-bold px-3 py-1 rounded-md border border-blue-500/20">
            Total Clients: {rows.length}
          </span>
        </header>

        {/* Informative Tips Block */}
        <div className="bg-slate-900/40 border border-slate-800 p-3 rounded-lg text-xs text-slate-400">
          💡 <span className="text-slate-200 font-bold">Vibe Coder Tip:</span> Click directly into any text cell or yellow header column above to edit customer records on the fly. Use the buttons below to expand your fields.
        </div>

        {/* The Live Connected Editable Spreadsheet */}
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
