import React from 'react';

interface EditableTableProps {
  headers: string[];
  rows: Record<string, any>[];
  onUpdateHeaders: (newHeaders: string[]) => void;
  onUpdateRows: (newRows: Record<string, any>[]) => void;
  statusColumnName?: string;
}

export default function EditableTable({
  headers,
  rows,
  onUpdateHeaders,
  onUpdateRows,
  statusColumnName = 'status'
}: EditableTableProps) {

  // 1. Handle cell content updates inline
  const handleCellChange = (rowIndex: number, header: string, value: string) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][header] = value;

    // AUTOMATED RULE: If status changes to 'delivered', sort row to bottom
    if (header.toLowerCase() === statusColumnName.toLowerCase() && value.toLowerCase() === 'delivered') {
      // Sort rows so 'delivered' ones sit at the absolute end
      updatedRows.sort((a, b) => {
        const aDelivered = (a[header] || '').toLowerCase() === 'delivered';
        const bDelivered = (b[header] || '').toLowerCase() === 'delivered';
        return aDelivered === bDelivered ? 0 : aDelivered ? 1 : -1;
      });
    }
    onUpdateRows(updatedRows);
  };

  // 2. Handle Header adjustments on the fly
  const handleHeaderChange = (index: number, value: string) => {
    const oldHeader = headers[index];
    const newHeaders = [...headers];
    newHeaders[index] = value;
    onUpdateHeaders(newHeaders);

    // Update keys in existing row objects to prevent data loss
    const updatedRows = rows.map(row => {
      const newRow = { ...row };
      newRow[value] = newRow[oldHeader];
      delete newRow[oldHeader];
      return newRow;
    });
    onUpdateRows(updatedRows);
  };

  // 3. Append a completely empty cell structure row
  const addRow = () => {
    const newRow: Record<string, string> = {};
    headers.forEach(h => { newRow[h] = ''; });
    onUpdateRows([...rows, newRow]);
  };

  // 4. Append a completely new custom data column
  const addColumn = () => {
    const columnName = `Column_${headers.length + 1}`;
    onUpdateHeaders([...headers, columnName]);
    const updatedRows = rows.map(row => ({ ...row, [columnName]: '' }));
    onUpdateRows(updatedRows);
  };

  // 5. Delete selected record instantly
  const deleteRow = (index: number) => {
    onUpdateRows(rows.filter((_, i) => i !== index));
  };

  // 6. Export data to standard CSV
  const exportToCSV = () => {
    const csvContent = [
      headers.join(','),
      ...rows.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'erp_data_export.csv');
    link.click();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl font-mono">
      <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
        <div className="flex gap-2">
          <button onClick={addRow} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded text-xs transition">
            + Add Row
          </button>
          <button onClick={addColumn} className="bg-blue-500 hover:bg-blue-400 text-slate-100 font-bold px-3 py-1.5 rounded text-xs transition">
            + Add Column
          </button>
        </div>
        <button onClick={exportToCSV} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded text-xs transition border border-slate-700">
          📥 Export CSV
        </button>
      </div>

      <div className="overflow-x-auto border border-slate-800 rounded-lg">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800">
              {headers.map((header, idx) => (
                <th key={idx} className="p-2.5 min-w-[120px]">
                  <input
                    type="text"
                    value={header}
                    onChange={(e) => handleHeaderChange(idx, e.target.value)}
                    className="bg-transparent font-bold text-amber-400 focus:outline-none focus:border-b border-amber-500 w-full"
                  />
                </th>
              ))}
              <th className="p-2.5 w-[50px] text-center text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => {
              const isDelivered = Object.values(row).some(val => String(val).toLowerCase() === 'delivered');
              return (
                <tr key={rIdx} className={`border-b border-slate-800/60 transition ${isDelivered ? 'bg-slate-950/40 text-slate-600 line-through' : 'hover:bg-slate-900/50 text-slate-200'}`}>
                  {headers.map((header, cIdx) => (
                    <td key={cIdx} className="p-2">
                      <input
                        type="text"
                        value={row[header] || ''}
                        onChange={(e) => handleCellChange(rIdx, header, e.target.value)}
                        className="bg-transparent focus:outline-none focus:bg-slate-950 px-1 py-0.5 rounded w-full border border-transparent focus:border-slate-800"
                        placeholder="..."
                      />
                    </td>
                  ))}
                  <td className="p-2 text-center">
                    <button onClick={() => deleteRow(rIdx)} className="text-rose-400 hover:text-rose-300 font-bold px-1 text-[11px]">
                      ✕
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
