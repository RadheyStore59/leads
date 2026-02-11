
import React from 'react';
import { SearchResult } from '../types';

interface ResultTableProps {
  data: SearchResult[];
}

const ResultTable: React.FC<ResultTableProps> = ({ data }) => {
  if (data.length === 0) return null;

  const exportToCSV = () => {
    const headers = ['Name', 'Phone', 'Email', 'Website', 'Address', 'Source'];
    const rows = data.map(item => [
      `"${(item.name || '').replace(/"/g, '""')}"`,
      `"${(item.phone || '').replace(/"/g, '""')}"`,
      `"${(item.email || '').replace(/"/g, '""')}"`,
      `"${(item.website || '').replace(/"/g, '""')}"`,
      `"${(item.address || '').replace(/"/g, '""')}"`,
      `"${(item.sourceUrl || '').replace(/"/g, '""')}"`
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_export_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            Verified Leads
            <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-xl text-sm font-black shadow-sm">
              {data.length} Records
            </span>
          </h3>
          <p className="text-slate-400 text-sm font-medium mt-1">Deep-extracted contact information from live web data.</p>
        </div>
        <button 
          onClick={exportToCSV}
          className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-black hover:bg-slate-800 transition-all shadow-xl hover:-translate-y-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV Database
        </button>
      </div>
      
      <div className="w-full overflow-x-auto bg-white rounded-[2rem] border-2 border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-[20%]">Business Name</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-[15%]">Phone</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-[20%]">Email</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-[15%]">Website</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-[25%]">Address</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-12 text-center">Verify</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-cyan-50/30 transition-all group">
                <td className="px-8 py-6">
                  <div className="text-sm font-black text-slate-900 group-hover:text-cyan-600 transition-colors">{item.name}</div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-xs font-black text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                    {item.phone && item.phone !== "N/A" ? item.phone : "Not Found"}
                  </span>
                </td>
                <td className="px-8 py-6">
                  {item.email && item.email !== "N/A" ? (
                    <a href={`mailto:${item.email}`} className="text-xs font-bold text-cyan-600 hover:underline">
                      {item.email}
                    </a>
                  ) : (
                    <span className="text-[10px] font-black text-slate-300 uppercase italic">Request Details</span>
                  )}
                </td>
                <td className="px-8 py-6">
                  {item.website && item.website !== "N/A" ? (
                    <a href={item.website.startsWith('http') ? item.website : `https://${item.website}`} target="_blank" rel="noopener noreferrer" className="text-xs font-black text-indigo-500 hover:text-indigo-700 flex items-center gap-1.5">
                      Visit Site
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <span className="text-slate-300 text-xs">-</span>
                  )}
                </td>
                <td className="px-8 py-6">
                  <div className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2 max-w-xs">{item.address}</div>
                </td>
                <td className="px-8 py-6 text-center">
                   {item.sourceUrl && item.sourceUrl !== "N/A" ? (
                      <a 
                        href={item.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 text-slate-300 hover:bg-cyan-600 hover:text-white transition-all shadow-sm"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                         </svg>
                      </a>
                   ) : <span className="text-slate-200">-</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultTable;
