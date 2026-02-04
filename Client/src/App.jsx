import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Pause, RotateCcw, Activity, Settings2 } from 'lucide-react';
import RoadLayer from './features/simulation/components/RoadLayer';

function App() {
  const [data, setData] = useState({ lanes: { north:[], south:[], east:[], west:[] }, light_state: 'NS_GREEN', stats: { q_ns:0, q_ew:0 } });
  const [params, setParams] = useState({ arrival_rate_ns: 0.8, arrival_rate_ew: 0.4, mode: 'smart' });
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        axios.post('http://localhost:8000/step', params)
          .then(res => setData(res.data))
          .catch(err => console.error(err));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [running, params]);

  const reset = async () => {
    await axios.post('http://localhost:8000/reset');
    setData({ lanes: { north:[], south:[], east:[], west:[] }, light_state: 'NS_GREEN', stats: { q_ns:0, q_ew:0 } });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-emerald-500/30">
      
      {/* TOP NAV BAR */}
      <div className="w-full border-b border-slate-800 bg-slate-900/50 backdrop-blur-md p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
             <Activity className="text-emerald-400" size={24} />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
            NeuroCross <span className="text-xs text-slate-500 font-mono font-normal tracking-widest ml-2">SIMULATION V1.0</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8 flex flex-col lg:flex-row gap-8 items-start justify-center">
        
        {/* --- LEFT SIDEBAR: CONTROLS --- */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          
          {/* Card 1: Traffic Parameters */}
          <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-6 rounded-2xl shadow-xl">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-700 pb-4">
              <Settings2 size={18} className="text-slate-400" />
              <h2 className="font-semibold text-slate-100">Traffic Parameters</h2>
            </div>

            <div className="space-y-6">
              {/* North South Slider */}
              <div className="group">
                <div className="flex justify-between text-xs font-medium text-slate-400 mb-2 group-hover:text-emerald-400 transition-colors">
                  <span>North-South Flow</span>
                  <span className="font-mono">{params.arrival_rate_ns}/s</span>
                </div>
                <input 
                  type="range" min="0.1" max="2.0" step="0.1" 
                  value={params.arrival_rate_ns} 
                  onChange={e=>setParams({...params, arrival_rate_ns: parseFloat(e.target.value)})} 
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-all"
                />
              </div>

              {/* East West Slider */}
              <div className="group">
                <div className="flex justify-between text-xs font-medium text-slate-400 mb-2 group-hover:text-cyan-400 transition-colors">
                  <span>East-West Flow</span>
                  <span className="font-mono">{params.arrival_rate_ew}/s</span>
                </div>
                <input 
                  type="range" min="0.1" max="2.0" step="0.1" 
                  value={params.arrival_rate_ew} 
                  onChange={e=>setParams({...params, arrival_rate_ew: parseFloat(e.target.value)})} 
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Actions */}
          <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
            {/* Toggle */}
            <div className="bg-slate-950 p-1 rounded-xl flex border border-slate-800 relative">
              <button 
                onClick={()=>setParams({...params, mode: 'smart'})} 
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all z-10 ${params.mode === 'smart' ? 'text-white shadow-lg bg-emerald-600' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Smart AI
              </button>
              <button 
                onClick={()=>setParams({...params, mode: 'fixed'})} 
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all z-10 ${params.mode === 'fixed' ? 'text-white shadow-lg bg-cyan-600' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Fixed Timer
              </button>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={()=>setRunning(!running)} 
                className={`flex-1 py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-lg ${running ? 'bg-amber-500/10 text-amber-500 border border-amber-500/50' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-900'}`}
              >
                {running ? <><Pause size={18}/> Pause</> : <><Play size={18}/> Start</>}
              </button>
              <button 
                onClick={reset} 
                className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-all"
              >
                <RotateCcw size={20}/>
              </button>
            </div>
          </div>
          
          {/* Stats Mini Card */}
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-center">
                <div className="text-2xl font-mono text-emerald-400">{data.stats.q_ns}</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">N-S Queue</div>
             </div>
             <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-center">
                <div className="text-2xl font-mono text-cyan-400">{data.stats.q_ew}</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">E-W Queue</div>
             </div>
          </div>

        </div>

        {/* --- RIGHT: SIMULATION CANVAS --- */}
        <div className="relative group">
           {/* The Road Component */}
           <RoadLayer lanes={data.lanes} lightState={data.light_state} />
           
           {/* Floating Status Badge */}
           <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur text-xs font-mono text-slate-400 px-3 py-1 rounded-full border border-slate-700 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${running ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
              {running ? 'LIVE SIMULATION' : 'PAUSED'}
           </div>
        </div>

      </div>
    </div>
  );
}
export default App;