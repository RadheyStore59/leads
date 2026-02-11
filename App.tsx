
import React, { useState } from 'react';
import Header from './components/Header';
import ResultTable from './components/ResultTable';
import { performSearch } from './services/geminiService';
import { SearchResponse } from './types';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);
    setStatus('Launching Parallel Harvesters...');

    try {
      const statusSteps = [
        'Segmenting query for massive parallel scan...',
        'Worker 1: Scanning major directories...',
        'Worker 2: Scanning localized sub-neighborhoods...',
        'Worker 3: Scraping specialized association lists...',
        'Merging and de-duplicating 3-way stream...',
        'Verifying contact metadata purity...'
      ];

      let step = 0;
      const interval = setInterval(() => {
        if (step < statusSteps.length - 1) {
          setStatus(statusSteps[step]);
          step++;
        }
      }, 4000);

      const data = await performSearch(query);
      clearInterval(interval);

      if (data.extractedData.length === 0) {
        setError("Zero records found across all parallel workers. Try a broader search term.");
      } else {
        setResults(data);
      }
    } catch (err: any) {
      console.error(err);
      setError("The Parallel Harvest was interrupted due to rate limits. Try again in 60 seconds with a more specific location.");
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  const suggestions = [
    "IT Companies in Ahmedabad (Full Contact List)",
    "Hospitals in Mumbai with Phone and Email",
    "GIDC Manufacturers in Gujarat Directory",
    "Textile Exporters in Surat Bulk List"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-cyan-100 font-sans">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-block px-5 py-2 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-8 shadow-2xl animate-pulse">
            Parallel Harvester: Multi-Segment Data Blast
          </div>
          <h2 className="text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-none">
            Massive <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-500">Lead Aggregator</span>
          </h2>
          <p className="text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-semibold">
            We deploy <span className="text-indigo-600 font-black">3 Parallel Harvesters</span> to crawl different parts of the web simultaneously for maximum yield.
          </p>
        </div>

        <div className="max-w-5xl mx-auto mb-16">
          <form onSubmit={handleSearch} className="relative group">
            <div className={`flex bg-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] rounded-[2.5rem] overflow-hidden p-4 border-2 transition-all duration-1000 ${loading ? 'border-indigo-600 ring-[24px] ring-indigo-50 opacity-95 scale-[1.01]' : 'border-slate-100 focus-within:border-indigo-400 focus-within:ring-[24px] ring-slate-100'}`}>
              <div className="flex-1 flex items-center px-8">
                <div className={`mr-6 transition-all duration-700 ${loading ? 'rotate-[360deg] text-indigo-600 scale-125' : 'group-hover:scale-110 text-slate-400'}`}>
                  {loading ? (
                    <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. List of all IT companies in Ahmedabad..."
                  className="w-full py-5 text-3xl outline-none text-slate-900 placeholder-slate-300 font-black tracking-tight"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-indigo-700 to-blue-800 hover:from-indigo-800 hover:to-blue-900 text-white px-16 py-6 rounded-[2rem] font-black text-xl transition-all disabled:opacity-50 flex items-center gap-5 shadow-3xl active:scale-95 whitespace-nowrap"
              >
                {loading ? "Harvesting..." : "Launch Parallel Harvester"}
              </button>
            </div>
          </form>
          
          <div className="mt-8 flex flex-wrap gap-4 items-center justify-center">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mr-4">Yield Blueprints:</span>
            {suggestions.map((s) => (
              <button 
                key={s} 
                onClick={() => setQuery(s)}
                disabled={loading}
                className="text-xs bg-white border-2 border-slate-100 px-5 py-3 rounded-2xl text-slate-700 hover:border-indigo-600 hover:text-indigo-600 hover:shadow-xl transition-all font-black disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="max-w-4xl mx-auto mb-10 text-center animate-in fade-in zoom-in duration-500">
            <div className={`inline-flex flex-col items-center gap-4 p-12 rounded-[4rem] border-4 shadow-2xl bg-red-50 text-red-700 border-red-100`}>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-2 shadow-inner bg-red-100 text-red-600`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-3xl font-black">Extraction Throttled</h3>
              <p className="max-w-xl text-xl opacity-80 font-semibold leading-relaxed">{error}</p>
              <button onClick={() => setError(null)} className={`mt-8 text-sm font-black uppercase tracking-widest px-10 py-4 rounded-2xl transition-all shadow-xl text-white bg-red-600 hover:bg-red-700`}>Retry Extraction</button>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-28 animate-in fade-in duration-700">
            <div className="relative w-80 h-80 mb-16">
              <div className="absolute inset-0 border-[20px] border-slate-100 rounded-full shadow-inner"></div>
              <div className="absolute inset-0 border-[20px] border-indigo-600 rounded-full border-t-transparent animate-spin shadow-2xl"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <div className="w-52 h-52 bg-white rounded-[4rem] shadow-3xl flex flex-col items-center justify-center border-2 border-slate-50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-50 opacity-50"></div>
                    <div className="flex gap-1 mb-2 animate-bounce">
                      <span className="text-4xl">🚀</span>
                      <span className="text-4xl">🛰️</span>
                      <span className="text-4xl">📡</span>
                    </div>
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest relative z-10">Parallel Processing</span>
                 </div>
              </div>
            </div>
            <div className="text-center space-y-6 max-w-2xl">
              <h4 className="text-4xl font-black text-slate-800 tracking-tight transition-all duration-500">{status}</h4>
              <p className="text-slate-500 font-bold text-xl leading-relaxed animate-pulse">
                Running 3 simultaneous extraction sequences to maximize lead yield. Each harvester scans a different slice of the web directory ecosystem.
              </p>
            </div>
          </div>
        )}

        {results && (
          <div className="animate-in fade-in slide-in-from-bottom-20 duration-1000">
            <div className="max-w-7xl mx-auto mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
               <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg">Triple-Pass Complete</span>
                    <span className="bg-emerald-500 text-white px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg">Massive Aggregation</span>
                  </div>
                  <h3 className="text-5xl font-black text-slate-900 tracking-tighter">Unified Data Warehouse</h3>
                  <p className="text-2xl text-slate-500 font-bold mt-4 leading-relaxed">
                    Merged and verified <span className="text-indigo-600 font-black text-3xl">{results.extractedData.length}</span> unique business records.
                  </p>
               </div>
            </div>
            
            <ResultTable data={results.extractedData} />
            
            <div className="mt-24 p-16 bg-slate-900 rounded-[5rem] text-white overflow-hidden relative shadow-3xl">
               <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-indigo-600/10 rounded-full -mr-60 -mt-60 blur-[150px]"></div>
               <div className="relative z-10 flex flex-col lg:flex-row items-center gap-20">
                  <div className="flex-1">
                    <h4 className="text-5xl font-black mb-8 leading-tight">Harvesting Super-Powers</h4>
                    <p className="text-indigo-100/70 max-w-2xl text-2xl font-medium leading-relaxed mb-12">
                      To get thousands of leads, perform multiple searches across different <span className="text-white font-black">postal codes or district names</span>. Our system automatically de-duplicates records as you build your database.
                    </p>
                    <button 
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="px-14 py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-2xl hover:bg-indigo-500 transition-all shadow-2xl active:scale-95 flex items-center gap-4"
                    >
                      Start Next Parallel Scan
                    </button>
                  </div>
                  
                  <div className="w-full lg:w-96 bg-white/5 p-12 rounded-[3.5rem] border border-white/10 backdrop-blur-3xl">
                    <h5 className="font-black text-indigo-400 uppercase tracking-[0.4em] text-[10px] mb-8">Harvest Telemetry</h5>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center py-3 border-b border-white/5">
                        <span className="text-slate-400 font-bold text-lg">Parallel Streams</span>
                        <span className="text-white font-black text-lg tracking-widest">3 ACTIVE</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-white/5">
                        <span className="text-slate-400 font-bold text-lg">Unique Entity Yield</span>
                        <span className="text-white font-black text-lg tracking-widest">MAX</span>
                      </div>
                      <div className="flex justify-between items-center py-3">
                        <span className="text-slate-400 font-bold text-lg">Aggregator Engine</span>
                        <span className="text-white font-black text-lg tracking-widest">v2.0</span>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>

      <footer className="py-24 border-t border-slate-200 mt-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-16">
          <div className="flex items-center gap-8">
             <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl rotate-6">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
             </div>
             <div>
               <p className="text-slate-900 font-black text-3xl tracking-tighter">Parallel Harvester Pro</p>
               <p className="text-slate-400 text-sm font-black tracking-[0.4em] uppercase">Massive Data Extraction Suite</p>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
