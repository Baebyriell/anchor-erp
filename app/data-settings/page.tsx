'use client';
import React, { useState } from 'react';

export default function DataSettingsControl() {
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // 1. Wipe out local cache cleanly to start over
  const handleClearCache = (key: string, label: string) => {
    if (confirm(`Are you absolutely sure you want to clear all data for ${label}? This cannot be undone.`)) {
      localStorage.removeItem(key);
      alert(`${label} cache cleared successfully!`);
      window.location.reload();
    }
  };

  // 2. Simulated universal CSV parser connection point
  const handleCSVImportSimulated = (e: React.ChangeEvent<HTMLInputElement>, targetKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus(`Reading ${file.name}...`);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        // Basic split parsing string lines
        const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
        if (lines.length < 2) throw new Error("Invalid CSV format");

        setImportStatus(`✅ Successfully imported ${lines.length - 1} records into ${targetKey}!`);
      } catch (err) {
        setImportStatus(`❌ Error parsing file. Ensure standard format columns.`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-mono">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header section */}
        <header className="border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-black text-blue-400 tracking-tight flex items-center gap-2">
            ⚙️ Page 11: Data Control Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Perform global structural spreadsheet configurations and administrative file operations.
          </p>
        </header>

        {/* Global CSV Import Board Manager */}
        <section className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">
            📥 Bulk CSV Spreadsheets Importer Engine
          </h2>
          <p className="text-xs text-slate-400">
            Upload standard text layout comma-separated lists to batch-populate your operations ledgers instantly.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <label className="block text-xs font-bold text-blue-400 uppercase">Load CRM Customer List</label>
              <input type="file" accept=".csv" onChange={(e) => handleCSVImportSimulated(e, 'erp_customers_v2')} className="w-full text-xs text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700 cursor-pointer" />
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <label className="block text-xs font-bold text-amber-400 uppercase">Load Sourcing Pre-Orders</label>
              <input type="file" accept=".csv" onChange={(e) => handleCSVImportSimulated(e, 'erp_preorder_by_item_v2')} className="w-full text-xs text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700 cursor-pointer" />
            </div>
          </div>

          {importStatus && (
            <div className="bg-slate-950 border border-slate-800 p-2.5 rounded text-xs text-slate-300 font-bold text-center">
              {importStatus}
            </div>
          )}
        </section>

        {/* Danger Zone Cache Resets */}
        <section className="bg-slate-900 border border-rose-950/40 p-5 rounded-xl space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-rose-400 uppercase tracking-wider border-b border-rose-950/20 pb-2">
            ⚠️ Maintenance Zone & Cache Controls
          </h2>
          <p className="text-xs text-slate-400">
            Reset discrete layout data keys inside your system cache arrays to flush operational files or mock templates.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <button onClick={() => handleClearCache('erp_customers_v2', 'Customer CRM')} className="bg-rose-950/20 border border-rose-900/40 text-rose-400 px-3 py-1.5 rounded text-xs font-bold hover:bg-rose-900/30 transition">
              Wipe Customer CRM
            </button>
            <button onClick={() => handleClearCache('erp_sales_ledger_v2', 'Available Goods Sales')} className="bg-rose-950/20 border border-rose-900/40 text-rose-400 px-3 py-1.5 rounded text-xs font-bold hover:bg-rose-900/30 transition">
              Wipe Daily Sales Ledger
            </button>
            <button onClick={() => handleClearCache('erp_preorder_by_item_v2', 'Pre-Order Matrix')} className="bg-rose-950/20 border border-rose-900/40 text-rose-400 px-3 py-1.5 rounded text-xs font-bold hover:bg-rose-900/30 transition">
              Wipe Pre-Order Pipeline
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
