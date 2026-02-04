import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, RotateCcw } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 gap-6 font-sans">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">NeuroCross</h1>
      
      <div className="flex gap-8">
        {/* Controls */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 w-72 space-y-6">
          <div>
            <div className="text-xs text-slate-400 flex justify-between"><span>N-S Traffic</span> <span className="text-blue-400">{params.arrival_rate_ns}/s</span></div>
            <input type="range" min="0.1" max="2.0" step="0.1" value={params.arrival_rate_ns} onChange={e=>setParams({...params, arrival_rate_ns: parseFloat(e.target.value)})} className="w-full accent-blue-500"/>
          </div>
          <div>
            <div className="text-xs text-slate-400 flex justify-between"><span>E-W Traffic</span> <span className="text-emerald-400">{params.arrival_rate_ew}/s</span></div>
            <input type="range" min="0.1" max="2.0" step="0.1" value={params.arrival_rate_ew} onChange={e=>setParams({...params, arrival_rate_ew: parseFloat(e.target.value)})} className="w-full accent-emerald-500"/>
          </div>
          <div className="flex gap-2 bg-slate-800 p-1 rounded">
            {['smart', 'fixed'].map(m => (
              <button key={m} onClick={()=>setParams({...params, mode: m})} className={`flex-1 py-1 text-sm rounded capitalize ${params.mode === m ? 'bg-slate-700 text-white' : 'text-slate-500'}`}>{m}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={()=>setRunning(!running)} className={`flex-1 py-2 rounded font-bold flex justify-center items-center gap-2 ${running ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500 text-black'}`}>{running ? 'Pause' : 'Start'}</button>
            <button onClick={reset} className="p-2 bg-slate-800 rounded text-slate-400"><RotateCcw size={20}/></button>
          </div>
        </div>

        {/* Road */}
        <RoadLayer lanes={data.lanes} lightState={data.light_state} />
      </div>
    </div>
  );
}
export default App;