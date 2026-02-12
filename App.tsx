
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ResultTable from './components/ResultTable';
import { performSearch } from './services/geminiService';
import { SearchResponse, SearchResult } from './types';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [phase, setPhase] = useState(0);
  const [aggregatedResults, setAggregatedResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [hasOwnKey, setHasOwnKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasOwnKey(selected);
      }
    };
    checkKey();
    const interval = setInterval(checkKey, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasOwnKey(true);
      setError(null);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setError(null);
    setAggregatedResults([]);
    
    const allLeads: SearchResult[] = [];
    const modifiers = [
      "", // General Phase
      "official association directory list", // Registry Phase
      "IndiaMART TradeIndia contact numbers", // Portal Phase
      "industrial area focal point members" // Deep Regional Phase
    ];

    try {
      for (let i = 0; i < modifiers.length; i++) {
        setPhase(i + 1);
        setStatus(`Phase ${i + 1}/${modifiers.length}: ${modifiers[i] || 'General Search'}...`);
        
        const data = await performSearch(query, modifiers[i]);
        
        // Add new results and deduplicate
        data.extractedData.forEach(newLead => {
          const isDuplicate = allLeads.some(existing => 
            (existing.name.toLowerCase() === newLead.name.toLowerCase()) ||
            (existing.phone && existing.phone === newLead.phone)
          );
          if (!isDuplicate && newLead.phone) {
            allLeads.push(newLead);
          }
        });

        // Update UI progressively
        setAggregatedResults([...allLeads]);
        
        // Brief pause between phases to avoid rate limits
        if (i < modifiers.length - 1) await new Promise(r => setTimeout(r, 2000));
      }
    } catch (err: any) {
      console.error(err);
      if (err.message.includes("QUOTA_EXHAUSTED")) {
        setError("BULK SCAN INTERRUPTED: To extract 500+ leads, a personal API key is mandatory due to high volume requirements.");
      } else {
        setError(err.message || "Deep scan failed to complete all phases.");
      }
    } finally {
      setLoading(false);
      setStatus('');
      setPhase(0);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-100 font-sans">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
            <span className={`w-2 h-2 rounded-full ${hasOwnKey ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
            {hasOwnKey ? 'High-Volume Mode: Active' : 'Basic Mode: 10-20 Leads Max'}
          </div>
          <h2 className="text-6xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-none">
            Deep <span className="text-indigo-600">Lead Harvester</span>
          </h2>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto font-bold leading-relaxed">
            Multi-phase directory scanning to extract hundreds of verified industrial contacts.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-20">
          <form onSubmit={handleSearch} className="relative group">
            <div className={`flex flex-col md:flex-row bg-white rounded-[2.5rem] overflow-hidden p-3 border-4 transition-all duration-500 ${loading ? 'border-indigo-600 ring-[16px] ring-indigo-50 scale-[1.02]' : 'border-slate-100 focus-within:border-indigo-400 shadow-2xl shadow-indigo-500/10'}`}>
              <div className="flex-1 flex items-center px-8 py-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Pharmaceutical manufacturers in Ahmedabad"
                  className="w-full py-4 text-2xl outline-none text-slate-900 placeholder-slate-300 font-black tracking-tight bg-transparent"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-5 rounded-[1.8rem] font-black text-xl transition-all disabled:opacity-50 flex items-center justify-center gap-4 shadow-xl active:scale-95 m-1 whitespace-nowrap"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {timer}s
                  </div>
                ) : "Bulk Deep Scan"}
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="max-w-4xl mx-auto mb-16 animate-in fade-in slide-in-from-top-6 duration-500">
            <div className="p-10 rounded-[3rem] bg-white border-4 border-rose-100 shadow-2xl">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                   <div className="w-20 h-20 rounded-[2rem] bg-rose-600 text-white flex items-center justify-center shrink-0">
                    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                   </div>
                   <div className="flex-1 text-center md:text-left">
                     <h3 className="text-3xl font-black mb-4 text-slate-900 tracking-tight">Bulk Scan Halted</h3>
                     <p className="text-lg font-bold text-slate-600 mb-10 leading-relaxed">{error}</p>
                     <button 
                        onClick={handleSelectKey}
                        className="px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-lg hover:bg-indigo-700 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
                      >
                        Connect Personal API Key
                      </button>
                   </div>
                </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-700">
            <div className="w-full max-w-md bg-white p-8 rounded-[2rem] border-2 border-slate-100 shadow-xl mb-12">
               <div className="flex justify-between items-center mb-6">
                 <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Phase {phase} of 4</span>
                 <span className="text-indigo-600 font-black text-2xl">{aggregatedResults.length} Leads Found</span>
               </div>
               <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-indigo-600 transition-all duration-1000" 
                   style={{ width: `${(phase / 4) * 100}%` }}
                 ></div>
               </div>
               <p className="mt-6 text-center text-slate-900 font-black text-lg">{status}</p>
            </div>
            <div className="w-32 h-32 relative">
               <div className="absolute inset-0 border-8 border-slate-100 rounded-full"></div>
               <div className="absolute inset-0 border-8 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
          </div>
        )}

        {aggregatedResults.length > 0 && <ResultTable data={aggregatedResults} />}
      </main>
    </div>
  );
};

export default App;
