
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
    link.setAttribute("download", `verified_leads_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h3 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tighter">
            Verified Leads
            <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-2xl text-sm font-black shadow-lg shadow-indigo-200">
              {data.length} Records
            </span>
          </h3>
          <p className="text-slate-500 font-bold mt-2">Database generated from deep-registry web harvesting.</p>
        </div>
        <button 
          onClick={exportToCSV}
          className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-sm hover:bg-indigo-600 transition-all shadow-2xl active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Leads (CSV)
        </button>
      </div>
      
      <div className="w-full overflow-x-auto bg-white rounded-[3rem] border-4 border-slate-50 shadow-2xl overflow-hidden">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead>
            <tr className="bg-slate-50/80 border-b-2 border-slate-100">
              <th className="px-8 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] w-[20%]">Company</th>
              <th className="px-8 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] w-[18%]">Contact Phone</th>
              <th className="px-8 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] w-[18%]">Business Email</th>
              <th className="px-8 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] w-[14%]">Website</th>
              <th className="px-8 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] w-[25%]">Address</th>
              <th className="px-8 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] w-12 text-center">Verify</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-slate-50">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-indigo-50/40 transition-all group">
                <td className="px-8 py-7">
                  <div className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">{item.name}</div>
                </td>
                <td className="px-8 py-7">
                  {item.phone && item.phone !== "N/A" ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <a href={`tel:${item.phone}`} className="text-sm font-black text-slate-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                        {item.phone}
                      </a>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-rose-100 italic">
                      Not Found
                    </div>
                  )}
                </td>
                <td className="px-8 py-7">
                  {item.email && item.email !== "N/A" ? (
                    <a href={`mailto:${item.email}`} className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-2 truncate max-w-[180px]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {item.email}
                    </a>
                  ) : (
                    <span className="text-[10px] font-black text-slate-300 uppercase italic tracking-widest">Deep Scan Req</span>
                  )}
                </td>
                <td className="px-8 py-7">
                  {item.website && item.website !== "N/A" ? (
                    <a href={item.website.startsWith('http') ? item.website : `https://${item.website}`} target="_blank" rel="noopener noreferrer" className="text-xs font-black text-slate-500 hover:text-indigo-600 flex items-center gap-2 transition-all">
                      Visit Site
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <span className="text-slate-300 text-xs">-</span>
                  )}
                </td>
                <td className="px-8 py-7">
                  <div className="text-xs text-slate-500 font-bold leading-relaxed line-clamp-2 max-w-xs">{item.address}</div>
                </td>
                <td className="px-8 py-7 text-center">
                   {item.sourceUrl && item.sourceUrl !== "N/A" ? (
                      <a 
                        href={item.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-50 text-slate-300 hover:bg-indigo-600 hover:text-white transition-all shadow-sm group/btn"
                        title="View Raw Data Source"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
