
import React, { useState, useMemo } from 'react';
import { CITY_PHASES, SUBJECT_TOPICS } from './constants';
import { generatePBLContent, PBLDayResponse, SessionData } from './services/geminiService';
import { 
  BookOpen, 
  Map as MapIcon, 
  ChevronRight, 
  ChevronLeft,
  Download, 
  Loader2, 
  Info, 
  HardHat, 
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Construction,
  ScrollText,
  FileText,
  ClipboardCheck
} from 'lucide-react';

type ViewMode = 'HOME' | 'PLAN' | 'CONTENT';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('HOME');
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [dayData, setDayData] = useState<PBLDayResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Derive current phase and topic
  const getDetailsForDay = (day: number) => {
    const phase = CITY_PHASES.find(p => day >= p.startDay && day <= p.endDay) || CITY_PHASES[0];
    const subject = phase.subjects[day % phase.subjects.length];
    const topics = SUBJECT_TOPICS[subject] || ["General Engineering"];
    const topic = topics[day % topics.length];
    return { phase, subject, topic };
  };

  const { phase: currentPhase, subject: currentSubject, topic: currentTopic } = useMemo(() => 
    getDetailsForDay(selectedDay), [selectedDay]);

  const handleGenerate = async (dayOverride?: number) => {
    const targetDay = dayOverride ?? selectedDay;
    if (dayOverride) setSelectedDay(dayOverride);
    
    setIsGenerating(true);
    setError(null);
    setDayData(null);
    setViewMode('CONTENT');
    setIsSidebarOpen(false);
    
    const details = getDetailsForDay(targetDay);
    
    try {
      const data = await generatePBLContent(
        targetDay,
        details.topic,
        details.subject,
        details.phase.description
      );
      setDayData(data);
    } catch (err: any) {
      setError(err.message || "Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!dayData) return;
    
    const fullText = dayData.sessions.map(s => 
      `# ${s.title} (${s.type})\n\n${s.content}\n\n---\n`
    ).join('\n');

    const blob = new Blob([fullText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SSC_JE_Day_${selectedDay}_Study_Module.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const updateDay = (val: number) => {
    const nextDay = Math.max(1, Math.min(360, val));
    setSelectedDay(nextDay);
    setDayData(null);
  };

  // --- VIEW: HOME ---
  if (viewMode === 'HOME') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="max-w-3xl w-full space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full text-yellow-400 text-sm font-bold tracking-widest uppercase">
            <HardHat size={18} />
            Civil Engineering PBL
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none italic">
            SSC JE <span className="text-yellow-400">ARCHITECT</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-medium max-w-2xl mx-auto">
            Optimized, fast, and token-efficient. Master the SSC JE syllabus through the construction of an imaginary city.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left mt-12">
            {[
              { icon: <ScrollText className="text-blue-400" />, title: "Concise Modules", text: "Exam-oriented content without the fluff." },
              { icon: <Construction className="text-green-400" />, title: "Session Boxes", text: "4 distinct sessions for structured study." },
              { icon: <ClipboardCheck className="text-purple-400" />, title: "PYQ Focused", text: "Includes solutions to recent JE papers." }
            ].map((item, i) => (
              <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="mb-3">{item.icon}</div>
                <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-normal">{item.text}</p>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setViewMode('PLAN')}
            className="mt-8 group relative inline-flex items-center gap-3 px-10 py-5 bg-yellow-400 text-slate-900 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-yellow-400/20"
          >
            GET STARTED
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // --- VIEW: PLAN ---
  if (viewMode === 'PLAN') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className="h-20 bg-slate-900 text-white flex items-center justify-between px-6 md:px-12 sticky top-0 z-30 shadow-lg">
          <div className="flex items-center gap-4">
            <button onClick={() => setViewMode('HOME')} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="font-black text-xl tracking-tight uppercase italic flex items-center gap-2">
                <Calendar className="text-yellow-400" size={20} />
                360-Day Master Plan
              </h1>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-12 overflow-y-auto max-w-6xl mx-auto w-full">
          {CITY_PHASES.map((phase) => (
            <section key={phase.name} className="mb-12">
              <div className="flex flex-col md:flex-row md:items-end gap-2 mb-6 border-b-2 border-slate-200 pb-4">
                <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">{phase.name}</h2>
                <span className="text-sm font-bold text-slate-400 md:ml-auto">DAYS {phase.startDay} — {phase.endDay}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: phase.endDay - phase.startDay + 1 }).map((_, i) => {
                  const day = phase.startDay + i;
                  const { subject, topic } = getDetailsForDay(day);
                  return (
                    <div key={day} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-yellow-400 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2 py-1 bg-slate-900 text-white text-[10px] font-black rounded italic">DAY {day}</span>
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter truncate">{subject}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm mb-4 leading-snug">{topic}</h3>
                      <button 
                        onClick={() => handleGenerate(day)}
                        className="w-full py-2 bg-slate-100 hover:bg-yellow-400 text-slate-600 hover:text-slate-900 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                      >
                        Start Learning <ChevronRight size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </main>
      </div>
    );
  }

  // --- VIEW: CONTENT (GENERATOR) ---
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar: Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col shadow-xl transition-transform duration-300 md:relative md:translate-x-0 md:shadow-sm ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-base uppercase tracking-wider">SSC JE PBL</h1>
            <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}><X size={20} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <button onClick={() => setViewMode('PLAN')} className="w-full py-2 flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900"><ArrowLeft size={16} /> Back to Plan</button>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Day Selection</label>
              <div className="flex items-center gap-2">
                <button onClick={() => updateDay(selectedDay - 1)} disabled={selectedDay <= 1} className="p-2 border rounded-lg"><ChevronLeft size={18} /></button>
                <div className="flex-1 text-center font-bold text-slate-900">Day {selectedDay}</div>
                <button onClick={() => updateDay(selectedDay + 1)} disabled={selectedDay >= 360} className="p-2 border rounded-lg"><ChevronRight size={18} /></button>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">{currentSubject}</span>
              <p className="text-sm font-bold text-slate-800 leading-snug mt-1">{currentTopic}</p>
            </div>
          </div>

          <button onClick={() => handleGenerate()} disabled={isGenerating} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-900/10 hover:bg-slate-800 disabled:opacity-50 transition-all">
            {isGenerating ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'GENERATE MODULE'}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-30 shrink-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
            <h2 className="font-bold text-slate-800 text-sm md:text-base truncate max-w-[200px] md:max-w-none">
              Day {selectedDay}: {currentTopic}
            </h2>
          </div>
          {dayData && (
            <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-slate-900 rounded-lg font-bold text-xs shadow-sm">
              <Download size={16} /> Download Source
            </button>
          )}
        </header>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6">
          {isGenerating && (
            <div className="h-full flex flex-col items-center justify-center space-y-4 py-10">
              <div className="relative">
                <Loader2 className="animate-spin text-yellow-400" size={64} strokeWidth={3} />
                <HardHat className="absolute inset-0 m-auto text-slate-400" size={28} />
              </div>
              <div className="text-center">
                <h3 className="font-black text-slate-800 text-lg italic tracking-tight uppercase">Architecting Study Module</h3>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Token-Efficient Analysis...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 p-6 rounded-2xl flex flex-col items-center text-center max-w-xl mx-auto">
              <AlertCircle className="text-red-500 mb-4" size={48} />
              <h3 className="font-bold text-red-900">Synthesis Failed</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button onClick={() => handleGenerate()} className="mt-6 px-8 py-3 bg-red-600 text-white rounded-xl font-bold">Retry</button>
            </div>
          )}

          {dayData && !isGenerating && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
              {dayData.sessions.map((session, index) => (
                <div key={index} className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className={`px-6 py-4 flex justify-between items-center border-b border-slate-100 ${session.type === 'Theory' ? 'bg-blue-50/50' : 'bg-green-50/50'}`}>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-black text-xs text-slate-400">
                        0{index + 1}
                      </span>
                      <h3 className="font-bold text-slate-800 text-sm tracking-tight uppercase">{session.title}</h3>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${session.type === 'Theory' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {session.type}
                    </span>
                  </div>
                  <div className="p-6 md:p-8 flex-1 overflow-y-auto max-h-[400px]">
                    <div className="prose prose-slate prose-sm max-w-none mono text-[13px] leading-relaxed whitespace-pre-wrap">
                      {session.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!dayData && !isGenerating && !error && (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 py-20">
              <ScrollText size={64} className="mb-4 opacity-20" />
              <p className="font-bold text-lg uppercase tracking-tighter italic">Ready to synthesize Day {selectedDay}</p>
              <p className="text-xs text-slate-400 mt-2">Click Generate Module to begin the Project-Based Learning analysis.</p>
            </div>
          )}
        </div>

        <footer className="h-10 bg-white border-t border-slate-100 px-6 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest shrink-0">
          <div className="flex items-center gap-2 italic"><Info size={12} /> Powered by Gemini Flash 3.0</div>
          <div>Efficiency Optimized</div>
        </footer>
      </main>
    </div>
  );
};

export default App;
