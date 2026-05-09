import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, Activity } from 'lucide-react';

const routines: Record<number, { title: string; description: string }> = {
  1: { title: 'Wrist Mobility & Dead Hangs', description: 'Decompress your spine and prepare your wrists for coding.' },
  5: { title: 'Arch Body Holds & Core', description: 'Counteract the developer hunch with posterior chain activation.' },
  10: { title: 'Ring Chest Flys & Push-ups', description: 'Solid blood flow to the chest and shoulders. Strict form.' },
  15: { title: 'Pull-ups & Dips Supersets', description: 'Classic push/pull. Break it down into EMOM.' },
  20: { title: 'Handstand Practice & Tuck Front Levers', description: 'Focus on balance and straight-arm core strength.' },
  30: { title: 'Full Muscle-Up Progressions', description: 'Explosive pulling and deep dipping. Quality over quantity.' }
};

const durations = [1, 5, 10, 15, 20, 30];

export default function App() {
  const [selectedDuration, setSelectedDuration] = useState<number>(5);
  const [activeRoutine, setActiveRoutine] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      setIsFinished(true);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleGenerate = () => {
    setActiveRoutine(selectedDuration);
    setTimeLeft(selectedDuration * 60);
    setIsRunning(false);
    setIsFinished(false);
  };

  const toggleTimer = () => setIsRunning(!isRunning);
  
  const resetTimer = () => {
    setIsRunning(false);
    if (activeRoutine) setTimeLeft(activeRoutine * 60);
    setIsFinished(false);
  };

  const markAsDone = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setIsFinished(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-200 font-sans overflow-hidden select-none">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 sm:px-8 py-5 sm:py-6 border-b border-slate-800 bg-slate-900/50 shrink-0 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <h1 className="text-2xl font-bold tracking-tight text-emerald-400 font-mono">CaliCode.v1</h1>
          </div>
          <p className="text-slate-400 text-sm">Optimize your downtime. Stay fit while the AI agents cook.</p>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono">
          <div className="px-3 py-1 rounded bg-slate-800 border border-slate-700 flex gap-2">
            <span className="text-slate-500 hidden sm:inline">AGENT_STATUS:</span> 
            <span className="text-emerald-500">{isRunning ? 'ACTIVE' : (isFinished ? 'IDLE' : 'WAITING')}</span>
          </div>
          <div className="px-3 py-1 rounded bg-slate-800 border border-slate-700 flex gap-2">
            <span className="text-slate-500 hidden sm:inline">HEART_RATE:</span> 
            <span className={isRunning ? "text-rose-400 animate-pulse" : "text-rose-400/50"}>{isRunning ? '120 BPM' : '72 BPM'}</span>
          </div>
        </div>
      </header>

      <main className="flex flex-col md:flex-row flex-1 overflow-auto md:overflow-hidden p-4 sm:p-6 gap-6">
        {/* Sidebar: Duration Selection */}
        <aside className="w-full md:w-72 flex flex-col gap-6 shrink-0 h-auto md:h-full">
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 flex flex-col h-full">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Select Window</h2>
            <div className="grid grid-cols-3 md:grid-cols-2 gap-3 mb-6">
              {durations.map((duration) => (
                <button
                  key={duration}
                  onClick={() => setSelectedDuration(duration)}
                  className={`py-3 px-2 rounded-lg border transition-all text-center focus:outline-none ${
                    selectedDuration === duration
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                      : 'border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-slate-300'
                  }`}
                >
                  <span className="block text-lg font-bold">{duration}</span>
                  <span className={`text-[10px] uppercase ${selectedDuration === duration ? 'text-emerald-400/70' : 'text-slate-500'}`}>Min</span>
                </button>
              ))}
            </div>
            
            <button
              onClick={handleGenerate}
              className="md:mt-auto w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
            >
              <Activity className="w-5 h-5 flex-shrink-0" />
              GENERATE_ROUTINE
            </button>
          </div>
        </aside>

        {/* Main View: Exercise Plan & Timer */}
        <section className="flex-1 flex flex-col gap-6 min-h-0">
          {activeRoutine && !isFinished ? (
            <>
              {/* Active Routine Display */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 sm:p-6 shrink-0">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-100">{routines[activeRoutine].title}</h3>
                    <p className="text-emerald-500/80 font-mono text-sm mt-1">{routines[activeRoutine].description}</p>
                  </div>
                  <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 text-right shrink-0">
                    <span className="block text-[10px] text-slate-500 font-mono uppercase">Est. Burnt</span>
                    <span className="text-lg sm:text-xl font-bold font-mono text-slate-200">{Math.round(activeRoutine * 8.5)} KCAL</span>
                  </div>
                </div>
              </div>

              {/* Timer Control Panel */}
              <div className="flex-1 flex gap-6 flex-col sm:flex-row min-h-0">
                <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl flex flex-col items-center justify-center relative overflow-hidden min-h-[250px]">
                  <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div className="h-full w-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #10b981 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                  </div>
                  
                  <span className="text-[10px] font-mono text-emerald-500 mb-2 uppercase tracking-[0.3em] z-10">System.Timer.Tick</span>
                  <div className="text-7xl lg:text-9xl font-mono font-black text-slate-100 tracking-tighter tabular-nums z-10">
                    {formatTime(timeLeft).split(':').map((part, i) => (
                      <span key={i}>
                        {i > 0 ? ':' : ''}
                        <span className={i === 1 ? "text-emerald-500" : ""}>{part}</span>
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-8 flex gap-4 z-10">
                    <button
                      onClick={resetTimer}
                      className="px-6 md:px-8 py-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 transition-colors font-bold text-xs sm:text-sm tracking-widest uppercase text-slate-300"
                    >
                      Reset
                    </button>
                    <button
                      onClick={toggleTimer}
                      className="px-8 md:px-12 py-3 rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors font-bold text-xs sm:text-sm tracking-widest uppercase w-32 sm:w-40 flex justify-center"
                    >
                      {isRunning ? 'Pause' : 'Start'}
                    </button>
                  </div>
                </div>

                <div className="w-full sm:w-48 bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex flex-col shrink-0">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-4">Stats Log</h4>
                  <div className="flex-1 font-mono text-[10px] space-y-2 text-slate-400">
                    <div className="flex justify-between border-b border-slate-800 pb-1"><span>[ROUTINE]</span> <span className="text-emerald-500">READY</span></div>
                    {isRunning && <div className="flex justify-between border-b border-slate-800 pb-1"><span>[TIMER]</span> <span className="text-blue-400">COUNTING</span></div>}
                    {!isRunning && timeLeft > 0 && timeLeft < activeRoutine * 60 && <div className="flex justify-between border-b border-slate-800 pb-1"><span>[TIMER]</span> <span className="text-yellow-400">PAUSED</span></div>}
                  </div>
                  <button
                    onClick={markAsDone}
                    className="w-full py-2 bg-slate-800 border border-slate-700 hover:border-emerald-500/50 hover:text-emerald-400 rounded text-[10px] font-bold uppercase transition-colors mt-auto flex justify-center items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Mark as Done
                  </button>
                </div>
              </div>
            </>
          ) : isFinished ? (
            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
               <div className="w-16 h-16 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-slate-100 mb-2 font-mono">EXECUTION_COMPLETE</h3>
              <p className="text-slate-400 font-mono text-sm max-w-md mt-4">
                Workout successfully logged. Return to your terminal.
              </p>
              <div className="mt-8">
                 <button
                    onClick={() => { setIsFinished(false); setActiveRoutine(null); setTimeLeft(0); }}
                    className="px-8 py-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 transition-colors font-bold text-sm tracking-widest uppercase text-slate-200"
                >
                    ACKNOWLEDGE
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-slate-900/20 border border-slate-800/50 border-dashed rounded-xl flex flex-col items-center justify-center text-slate-500 font-mono text-sm min-h-[300px] p-8 text-center">
              <Activity className="w-8 h-8 mb-4 text-slate-700" />
              AWAITING PARAMETERS: Select duration and generate routine.
            </div>
          )}
        </section>
      </main>

      {/* Console Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 px-6 py-2 flex items-center justify-between font-mono text-[10px] shrink-0">
        <div className="flex gap-4 sm:gap-6 text-slate-500">
          <span className="hidden sm:inline">ROOT@CALICODE:~$ _</span>
          <span className="text-emerald-900 hidden sm:inline">MEMORY: 12GB/32GB</span>
          <span className="text-emerald-900">SESSION: 0x4f2a</span>
        </div>
        <div className="flex gap-4">
          {isFinished && <span className="text-emerald-500 italic hidden md:inline">Success Message: Workout complete! Time to review code logs.</span>}
          <span className="text-emerald-500 tracking-widest">v2.4.0-stable</span>
        </div>
      </footer>
    </div>
  );
}

