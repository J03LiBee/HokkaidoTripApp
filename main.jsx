// DEPRECATED: This file has been refactored into a modular structure
// Please see src/main.jsx for the new entry point
// This file is kept for reference only

import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged,
  signInWithCustomToken
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  writeBatch
} from 'firebase/firestore';
import { 
  LayoutDashboard,
  CalendarDays, 
  CheckSquare, 
  Plane, 
  Wallet, 
  MapPin, 
  Clock, 
  Plus, 
  Trash2, 
  X, 
  ThermometerSnowflake, 
  Wind,
  Save,
  Utensils,
  Home,
  ArrowRight,
  Snowflake
} from 'lucide-react';

// --- Firebase Configuration ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'hokkaido-2025-v2';

// --- Initial Data Seeding ---
const INITIAL_ITINERARY = [
  { date: '2025-12-31', time: '14:00', title: '抵達北海道', location: '新千歲機場', type: 'transport', notes: '搭車前往市區' },
  { date: '2025-12-31', time: '16:00', title: 'Check-in', location: '札幌酒店', type: 'stay', notes: '' },
  { date: '2025-12-31', time: '17:00', title: '狸小路商店街', location: '狸小路', type: 'activity', notes: '晚餐/逛街' },
  { date: '2026-01-01', time: '11:00', title: '初詣', location: '北海道神宮', type: 'activity', notes: '新年參拜' },
  { date: '2026-01-01', time: '13:00', title: 'Toriton 壽司', location: 'Toriton', type: 'food', notes: '要排兩個鐘' },
  { date: '2026-01-02', time: '08:00', title: '旭川一日遊', location: '旭川', type: 'activity', notes: '動物園' },
  { date: '2026-01-03', time: '10:00', title: '前往小樽', location: 'JR 札幌站', type: 'transport', notes: '' },
  { date: '2026-01-03', time: '12:00', title: '三角市場', location: '小樽', type: 'food', notes: '海鮮丼' },
];

const INITIAL_CHECKLIST = [
  { id: '1', text: '護照 (Passport)', checked: false, category: '重要' },
  { id: '2', text: '日元現金 / Credit Card', checked: false, category: '重要' },
  { id: '3', text: 'VJW QR Code', checked: false, category: '重要' },
  { id: '4', text: 'SIM 卡', checked: false, category: '電子' },
  { id: '5', text: '冰爪 (雪地防滑)', checked: false, category: '衣物' },
];

const INITIAL_BUDGET = [
  { id: '1', item: '機票', amount: 5580, payer: 'Jason', status: '已結算' },
  { id: '2', item: '一日團', amount: 588, payer: 'Jason', status: '未支付' },
];

// --- Components ---

const Snowfall = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
    {[...Array(15)].map((_, i) => (
      <div
        key={i}
        className="absolute bg-white rounded-full opacity-40 animate-fall"
        style={{
          left: `${Math.random() * 100}%`,
          top: `-${Math.random() * 20}%`,
          width: `${Math.random() * 6 + 2}px`,
          height: `${Math.random() * 6 + 2}px`,
          animationDuration: `${Math.random() * 10 + 10}s`,
          animationDelay: `${Math.random() * 10}s`,
        }}
      />
    ))}
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-600 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scaleIn">
        <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-800/50">
          <h3 className="text-xl font-bold text-blue-100">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Sub-Views ---

// 1. Dashboard View
const Dashboard = ({ itinerary, budget, checklist, onNavigate }) => {
  // Countdown Logic
  const targetDate = new Date('2025-12-31T00:00:00');
  const today = new Date();
  const diffTime = Math.max(0, targetDate - today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Upcoming Event
  const sortedItinerary = [...itinerary].sort((a, b) => 
    new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)
  );
  const nextEvent = sortedItinerary.find(e => new Date(`${e.date}T${e.time}`) > new Date()) || sortedItinerary[0];

  // Budget Calc
  const totalSpent = budget.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  
  // Checklist Calc
  const totalItems = checklist.length;
  const checkedItems = checklist.filter(i => i.checked).length;
  const progress = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-900 p-6 shadow-xl border border-blue-400/30">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <h2 className="text-blue-100 text-sm font-medium mb-1">距離出發還有</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-white">{diffDays}</span>
            <span className="text-lg text-blue-200">天</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-blue-100 bg-white/10 px-3 py-1.5 rounded-lg w-fit text-sm">
            <ThermometerSnowflake size={16} />
            預測氣溫: -5°C (小雪)
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div 
          onClick={() => onNavigate('budget')}
          className="bg-slate-800/60 backdrop-blur border border-white/5 p-4 rounded-2xl cursor-pointer hover:bg-slate-800 transition active:scale-95"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-green-500/20 text-green-400 rounded-lg">
              <Wallet size={20} />
            </div>
            <ArrowRight size={16} className="text-slate-500" />
          </div>
          <div className="text-slate-400 text-xs">總預算支出</div>
          <div className="text-xl font-bold text-white">${totalSpent.toLocaleString()}</div>
        </div>

        <div 
          onClick={() => onNavigate('checklist')}
          className="bg-slate-800/60 backdrop-blur border border-white/5 p-4 rounded-2xl cursor-pointer hover:bg-slate-800 transition active:scale-95"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">
              <CheckSquare size={20} />
            </div>
            <ArrowRight size={16} className="text-slate-500" />
          </div>
          <div className="text-slate-400 text-xs">行李準備</div>
          <div className="text-xl font-bold text-white">{Math.round(progress)}%</div>
          <div className="w-full h-1 bg-slate-700 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      {/* Next Event Card */}
      {nextEvent && (
         <div className="bg-slate-800/80 backdrop-blur border border-white/10 rounded-2xl p-5 shadow-lg">
           <h3 className="text-slate-400 text-xs uppercase tracking-wider mb-3 font-semibold">
             Upcoming • {nextEvent.date}
           </h3>
           <div className="flex gap-4 items-center">
             <div className="text-center min-w-[3.5rem] p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
               <div className="text-lg font-bold text-blue-400">{nextEvent.time.split(':')[0]}</div>
               <div className="text-xs text-blue-300">{nextEvent.time.split(':')[1]}</div>
             </div>
             <div>
               <h4 className="text-lg font-bold text-white leading-tight">{nextEvent.title}</h4>
               <div className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                 <MapPin size={12} /> {nextEvent.location || '未定地點'}
               </div>
             </div>
           </div>
         </div>
      )}

      {/* Flight Info Mini */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-5">
        <div className="flex justify-between items-center text-white mb-2">
           <div className="flex items-center gap-2">
             <Plane size={16} className="text-blue-400" />
             <span className="text-sm font-semibold">HKG -&gt; CTS</span>
           </div>
           <span className="text-xs bg-blue-600/30 text-blue-200 px-2 py-0.5 rounded">Dec 31</span>
        </div>
        <div className="flex justify-between text-xs text-slate-400">
          <span>09:15 出發</span>
          <span>14:15 抵達</span>
        </div>
      </div>
    </div>
  );
};

// 2. Table Itinerary View (The New Table)
const ItineraryTable = ({ itinerary, onEditSlot }) => {
  const dates = [
    '2025-12-31', '2026-01-01', '2026-01-02', '2026-01-03', 
    '2026-01-04', '2026-01-05', '2026-01-06', '2026-01-07', '2026-01-08'
  ];
  const hours = Array.from({ length: 16 }, (_, i) => i + 8); // 08:00 to 23:00

  // Optimize lookup
  const getEvent = (date, hour) => {
    return itinerary.find(e => {
      if (e.date !== date) return false;
      const eHour = parseInt(e.time.split(':')[0], 10);
      return eHour === hour;
    });
  };

  const getDayLabel = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    return `${date.getMonth() + 1}/${day}`;
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'food': return 'bg-orange-500/20 border-orange-500/30 text-orange-200';
      case 'transport': return 'bg-blue-500/20 border-blue-500/30 text-blue-200';
      case 'stay': return 'bg-purple-500/20 border-purple-500/30 text-purple-200';
      default: return 'bg-emerald-500/20 border-emerald-500/30 text-emerald-200';
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] w-full overflow-hidden flex flex-col bg-slate-900 border border-slate-700 rounded-xl relative">
      {/* Header Row */}
      <div className="flex overflow-x-auto border-b border-slate-700 bg-slate-800/90 z-20 hide-scrollbar ml-14">
         <div className="flex">
           {dates.map(date => (
             <div key={date} className="flex-none w-32 py-3 text-center border-r border-slate-700/50">
               <div className="text-white font-bold text-sm">{getDayLabel(date)}</div>
               <div className="text-slate-500 text-[10px]">{date.slice(5)}</div>
             </div>
           ))}
         </div>
      </div>

      {/* Grid Body */}
      <div className="flex-1 overflow-auto relative">
        <div className="flex relative min-w-max">
           {/* Sticky Time Column */}
           <div className="sticky left-0 z-10 w-14 bg-slate-800 border-r border-slate-700 flex flex-col">
             {hours.map(h => (
               <div key={h} className="h-24 flex items-center justify-center text-xs text-slate-400 border-b border-slate-700/50 relative">
                 {h}:00
               </div>
             ))}
           </div>

           {/* Event Columns */}
           <div className="flex">
             {dates.map(date => (
               <div key={date} className="w-32 flex-none flex flex-col border-r border-slate-700/50">
                 {hours.map(h => {
                   const event = getEvent(date, h);
                   return (
                     <div 
                       key={`${date}-${h}`} 
                       onClick={() => onEditSlot(date, `${h < 10 ? '0'+h : h}:00`, event)}
                       className={`h-24 p-1 border-b border-slate-700/50 relative group transition-colors hover:bg-white/5 cursor-pointer`}
                     >
                        {event ? (
                          <div className={`w-full h-full rounded p-1.5 text-xs overflow-hidden border ${getTypeColor(event.type)}`}>
                            <div className="font-bold truncate">{event.title}</div>
                            <div className="opacity-70 truncate text-[10px] mt-1">{event.time}</div>
                            {event.location && <div className="opacity-60 truncate text-[10px]">{event.location}</div>}
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100">
                             <Plus size={16} className="text-slate-600" />
                          </div>
                        )}
                     </div>
                   );
                 })}
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); // Default is Dashboard
  const [isLoading, setIsLoading] = useState(true);

  // Data States
  const [itinerary, setItinerary] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [budget, setBudget] = useState([]);
  
  // Modal States
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    date: '2025-12-31',
    time: '12:00',
    title: '',
    location: '',
    type: 'activity',
    notes: ''
  });

  // Auth & Init
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth failed", error);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Data Sync
  useEffect(() => {
    if (!user) return;
    const uid = user.uid;

    const unsubItinerary = onSnapshot(collection(db, 'artifacts', appId, 'users', uid, 'itinerary'), async (snap) => {
      if (snap.empty) {
        const batch = writeBatch(db);
        INITIAL_ITINERARY.forEach(item => batch.set(doc(collection(db, 'artifacts', appId, 'users', uid, 'itinerary')), item));
        await batch.commit();
      } else {
        setItinerary(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
      setIsLoading(false);
    });

    const unsubChecklist = onSnapshot(collection(db, 'artifacts', appId, 'users', uid, 'checklist'), async (snap) => {
       if (snap.empty) {
         const batch = writeBatch(db);
         INITIAL_CHECKLIST.forEach(item => batch.set(doc(collection(db, 'artifacts', appId, 'users', uid, 'checklist')), item));
         await batch.commit();
       } else {
         setChecklist(snap.docs.map(d => ({ id: d.id, ...d.data() })));
       }
    });

    const unsubBudget = onSnapshot(collection(db, 'artifacts', appId, 'users', uid, 'budget'), async (snap) => {
      if (snap.empty) {
        const batch = writeBatch(db);
        INITIAL_BUDGET.forEach(item => batch.set(doc(collection(db, 'artifacts', appId, 'users', uid, 'budget')), item));
        await batch.commit();
      } else {
        setBudget(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    });

    return () => {
      unsubItinerary();
      unsubChecklist();
      unsubBudget();
    };
  }, [user]);

  // Handlers
  const handleSlotClick = (date, time, existingEvent) => {
    if (existingEvent) {
      setEditingEvent(existingEvent);
      setNewEvent({ ...existingEvent });
    } else {
      setEditingEvent(null);
      setNewEvent({ date, time, title: '', location: '', type: 'activity', notes: '' });
    }
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = async () => {
    if (!user) return;
    const colRef = collection(db, 'artifacts', appId, 'users', user.uid, 'itinerary');
    try {
      if (editingEvent) {
        await updateDoc(doc(colRef, editingEvent.id), newEvent);
      } else {
        await addDoc(colRef, newEvent);
      }
      setIsEventModalOpen(false);
    } catch (e) { console.error(e); }
  };

  const handleDeleteEvent = async (id) => {
    if (!user || !window.confirm('刪除?')) return;
    await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'itinerary', id));
    setIsEventModalOpen(false);
  };

  const toggleCheck = async (item) => {
    await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'checklist', item.id), { checked: !item.checked });
  };

  if (isLoading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-blue-400">載入中...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-20 relative selection:bg-blue-500/30">
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) translateX(0px); }
          100% { transform: translateY(110vh) translateX(20px); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fall { animation-name: fall; animation-timing-function: linear; animation-iteration-count: infinite; }
        .animate-scaleIn { animation: scaleIn 0.15s ease-out; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      <Snowfall />

      {/* Top Bar */}
      <header className="fixed top-0 w-full z-40 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 px-4 h-16 flex items-center justify-between shadow-xl">
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide">
            {activeTab === 'dashboard' && '北海道冬之旅 ❄️'}
            {activeTab === 'itinerary' && '行程表 (Table)'}
            {activeTab === 'checklist' && '物資清單'}
            {activeTab === 'budget' && '旅程預算'}
          </h1>
        </div>
        {activeTab === 'itinerary' && (
           <button 
             onClick={() => handleSlotClick('2025-12-31', '12:00', null)}
             className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full shadow-lg shadow-blue-500/30"
           >
             <Plus size={20} />
           </button>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-20 px-4 max-w-3xl mx-auto h-full min-h-screen box-border relative z-10">
        
        {activeTab === 'dashboard' && (
          <Dashboard 
            itinerary={itinerary} 
            budget={budget} 
            checklist={checklist}
            onNavigate={setActiveTab} 
          />
        )}

        {activeTab === 'itinerary' && (
          <ItineraryTable itinerary={itinerary} onEditSlot={handleSlotClick} />
        )}

        {activeTab === 'checklist' && (
           <div className="space-y-4">
             {['重要', '衣物', '電子'].map(cat => {
               const items = checklist.filter(i => i.category === cat);
               if(!items.length) return null;
               return (
                 <div key={cat} className="bg-slate-800/50 backdrop-blur rounded-xl border border-white/5 overflow-hidden">
                   <div className="bg-slate-800 px-4 py-2 font-bold text-blue-200 text-sm">{cat}</div>
                   <div className="divide-y divide-white/5">
                     {items.map(item => (
                       <div key={item.id} onClick={() => toggleCheck(item)} className="p-4 flex gap-3 items-center hover:bg-white/5 cursor-pointer">
                          <div className={`w-5 h-5 rounded border flex items-center justify-center ${item.checked ? 'bg-blue-500 border-blue-500' : 'border-slate-500'}`}>
                            {item.checked && <X size={14} />}
                          </div>
                          <span className={item.checked ? 'line-through text-slate-500' : 'text-slate-200'}>{item.text}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               )
             })}
           </div>
        )}

        {activeTab === 'budget' && (
          <div className="space-y-4">
            <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-white/5 overflow-hidden">
               <table className="w-full text-sm">
                 <thead className="bg-slate-800 text-slate-400">
                   <tr>
                     <th className="p-3 text-left">項目</th>
                     <th className="p-3 text-right">金額</th>
                     <th className="p-3 text-center">狀態</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                   {budget.map(b => (
                     <tr key={b.id}>
                       <td className="p-3">
                         <div className="text-white">{b.item}</div>
                         <div className="text-xs text-slate-500">{b.payer}</div>
                       </td>
                       <td className="p-3 text-right font-mono text-blue-300">${b.amount}</td>
                       <td className="p-3 text-center">
                         <span className={`text-[10px] px-2 py-0.5 rounded border ${b.status === '已結算' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-orange-500/30 text-orange-400 bg-orange-500/10'}`}>
                           {b.status}
                         </span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full bg-slate-900/95 backdrop-blur-xl border-t border-white/10 z-50 pb-safe">
        <div className="grid grid-cols-4 h-16 max-w-3xl mx-auto">
          <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'dashboard' ? 'text-blue-400' : 'text-slate-500'}`}>
            <Home size={20} /> <span className="text-[10px]">首頁</span>
          </button>
          <button onClick={() => setActiveTab('itinerary')} className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'itinerary' ? 'text-blue-400' : 'text-slate-500'}`}>
            <CalendarDays size={20} /> <span className="text-[10px]">行程表</span>
          </button>
          <button onClick={() => setActiveTab('checklist')} className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'checklist' ? 'text-blue-400' : 'text-slate-500'}`}>
            <CheckSquare size={20} /> <span className="text-[10px]">清單</span>
          </button>
          <button onClick={() => setActiveTab('budget')} className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'budget' ? 'text-blue-400' : 'text-slate-500'}`}>
            <Wallet size={20} /> <span className="text-[10px]">預算</span>
          </button>
        </div>
      </nav>

      {/* Edit Modal */}
      <Modal 
        isOpen={isEventModalOpen} 
        onClose={() => setIsEventModalOpen(false)} 
        title={editingEvent ? '編輯行程' : '新增行程'}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400">日期</label>
              <input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" />
            </div>
            <div>
              <label className="text-xs text-slate-400">時間</label>
              <input type="time" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400">標題</label>
            <input type="text" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" placeholder="活動名稱" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400">類型</label>
              <select value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value})} className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white">
                <option value="activity">活動</option>
                <option value="food">餐飲</option>
                <option value="transport">交通</option>
                <option value="stay">住宿</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400">地點</label>
              <input type="text" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400">備註</label>
            <textarea rows="3" value={newEvent.notes} onChange={e => setNewEvent({...newEvent, notes: e.target.value})} className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" />
          </div>
          <div className="flex gap-3 pt-2">
            {editingEvent && (
              <button onClick={() => handleDeleteEvent(editingEvent.id)} className="flex-1 py-2 rounded bg-red-500/10 text-red-400 border border-red-500/20 flex justify-center items-center gap-2"><Trash2 size={16}/> 刪除</button>
            )}
            <button onClick={handleSaveEvent} className="flex-1 py-2 rounded bg-blue-600 text-white font-bold shadow-lg shadow-blue-900/50 flex justify-center items-center gap-2"><Save size={16}/> 儲存</button>
          </div>
        </div>
      </Modal>

    </div>
  );
}