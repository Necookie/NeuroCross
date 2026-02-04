import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Pause, RotateCcw, CloudRain, Sun } from 'lucide-react';
import RoadLayer from './features/simulation/components/RoadLayer';

function App() {
  const [data, setData] = useState({ 
    roads: { north: [[],[]], south: [[],[]], east: [[],[]], west: [[],[]] }, 
    light_state: 'NS_GREEN', 
    metrics: { accidents: 0, avg_speed: 0, throughput: 0 }
  });

  const [params, setParams] = useState({ 
    arrival_rate_ns: 0.8, 
    arrival_rate_ew: 0.4, 
    mode: 'smart',
    weather: 'sunny' 
  });
  
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
    setData({ 
        roads: { north: [[],[]], south: [[],[]], east: [[],[]], west: [[],[]] }, 
        light_state: 'NS_GREEN', 
        metrics: { accidents: 0, avg_speed: 0, throughput: 0 }
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans p-8 flex flex-col items-center gap-8">
      {/* HEADER */}
      <div className="w-full max-w-6xl flex justify-between items-end border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">NeuroCross PRO</h1>
        </div>
        <div className="flex gap-6 text-sm font-mono">
            <div className="text-center"><div className="text-slate-500 text-xs">THROUGHPUT</div><div className="text-emerald-400 text-xl font-bold">{data.metrics.throughput}</div></div>
            <div className="text-center"><div className="text-slate-500 text-xs">SPEED</div><div className="text-blue-400 text-xl font-bold">{data.metrics.avg_speed} km/h</div></div>
        </div>
      </div>

      <div className="flex gap-8 items-start">
        {/* CONTROLS */}
        <div className="flex flex-col gap-6 w-80">
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase">Environment</h3>
            <div className="flex bg-slate-950 p-1 rounded-lg">
                <button onClick={() => setParams({...params, weather: 'sunny'})} className={`flex-1 flex justify-center gap-2 py-2 rounded-md text-sm ${params.weather === 'sunny' ? 'bg-amber-500 text-black' : 'text-slate-500'}`}><Sun size={16}/> Sunny</button>
                <button onClick={() => setParams({...params, weather: 'rain'})} className={`flex-1 flex justify-center gap-2 py-2 rounded-md text-sm ${params.weather === 'rain' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}><CloudRain size={16}/> Rain</button>
            </div>
          </div>
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 space-y-6">
            <div>
                <div className="flex justify-between text-xs mb-2"><span>N-S Flow</span> <span className="text-blue-400">{params.arrival_rate_ns}</span></div>
                <input type="range" min="0.1" max="3.0" step="0.1" value={params.arrival_rate_ns} onChange={e=>setParams({...params, arrival_rate_ns: parseFloat(e.target.value)})} className="w-full accent-blue-500"/>
            </div>
            <div>
                <div className="flex justify-between text-xs mb-2"><span>E-W Flow</span> <span className="text-emerald-400">{params.arrival_rate_ew}</span></div>
                <input type="range" min="0.1" max="3.0" step="0.1" value={params.arrival_rate_ew} onChange={e=>setParams({...params, arrival_rate_ew: parseFloat(e.target.value)})} className="w-full accent-emerald-500"/>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={()=>setRunning(!running)} className={`flex-1 py-3 rounded-xl font-bold flex justify-center items-center gap-2 ${running ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-emerald-500 text-slate-900'}`}>{running ? <><Pause size={18}/> Pause</> : <><Play size={18}/> Start</>}</button>
            <button onClick={reset} className="p-3 bg-slate-800 rounded-xl text-slate-400 border border-slate-700"><RotateCcw size={20}/></button>
          </div>
        </div>

        {/* ROAD */}
        <RoadLayer roads={data.roads} lightState={data.light_state} weather={params.weather} />
      </div>
    </div>
  );
}
export default App;