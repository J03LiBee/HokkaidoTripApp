import React, { useState, useEffect, useRef } from 'react';
import { 
  Plane, 
  Calendar, 
  CheckSquare, 
  Home, 
  MapPin, 
  CloudSnow, 
  Plus, 
  MoreHorizontal, 
  Camera, 
  Sparkles,
  Wallet,
  ArrowRightLeft
} from 'lucide-react';

/**
 * WINTER TRAVEL PWA UI DEMO
 * * Aesthetic: "Morning Frost"
 * Colors: White, Slate, Icy Lavender (#E6E6FA), Warm Apricot (#FFDAB9)
 * Style: Glassmorphism, Clean, Elegant
 */

// --- Mock Data ---

const MOCK_WEATHER = {
  city: "Sapporo",
  temp: -2,
  condition: "Heavy Snow",
  high: 0,
  low: -6
};

const MOCK_ITINERARY = [
  { id: 1, time: "09:00", title: "Morning Coffee at Baristart", type: "food", icon: "☕" },
  { id: 2, time: "10:30", title: "Walk through Odori Park", type: "sightseeing", icon: "🌲" },
  { id: 3, time: "13:00", title: "Lunch: Soup Curry", type: "food", icon: "curry" }, // Icon placeholder
  { id: 4, time: "15:00", title: "Check-in: OMO3 Hotel", type: "hotel", icon: "🏨" },
];

const MOCK_CHECKLIST = [
  { id: 1, category: "Essentials", items: [
    { id: 101, text: "Passport", checked: true },
    { id: 102, text: "JR Pass Exchange Order", checked: false },
    { id: 103, text: "Sim Card / Wifi Egg", checked: false },
  ]},
  { id: 2, category: "Winter Gear", items: [
    { id: 201, text: "Heattech (Ultra Warm)", checked: true },
    { id: 202, text: "Waterproof Boots", checked: false },
    { id: 203, text: "Hand Warmers (Kairo)", checked: false },
  ]}
];

// --- Components ---

// 1. Snow Effect Component
const SnowEffect = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        speed: Math.random() * 1 + 0.5,
        opacity: Math.random() * 0.5 + 0.3
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
        
        p.y += p.speed;
        p.x += Math.sin(p.y * 0.01) * 0.5; // Slight sway

        if (p.y > height) {
          p.y = -10;
          p.x = Math.random() * width;
        }
      });
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" 
    />
  );
};

// 2. Navigation Bar
const NavBar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'trips', icon: Calendar, label: 'Itinerary' },
    { id: 'pack', icon: CheckSquare, label: 'Pack' },
    { id: 'flight', icon: Plane, label: 'Flight' },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-slate-200 z-50 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-300 ${isActive ? 'text-slate-800' : 'text-slate-400'}`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "drop-shadow-sm" : ""} />
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute top-0 w-8 h-1 bg-slate-800 rounded-b-full opacity-20" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// 3. Reusable Glass Card
const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-white/60 backdrop-blur-md border border-white/40 shadow-sm rounded-3xl p-5 ${className}`}>
    {children}
  </div>
);

// --- View: Home / Dashboard ---
const HomeView = () => {
  const [jpy, setJpy] = useState(1000);
  
  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-slate-500 text-sm font-medium tracking-wider uppercase mb-1">Dec 24 • Sapporo</p>
          <h1 className="text-4xl font-serif text-slate-800 tracking-tight">
            Winter<br/>Drift.
          </h1>
        </div>
        <button className="bg-white/50 p-2 rounded-full border border-white/60 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
             {/* Avatar Placeholder */}
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
          </div>
        </button>
      </div>

      {/* Weather Hero Card */}
      <GlassCard className="relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <CloudSnow size={120} />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center py-4">
          <div className="bg-indigo-50/50 p-3 rounded-full mb-3 backdrop-blur-sm">
            <CloudSnow className="text-slate-600" size={32} />
          </div>
          <h2 className="text-5xl font-serif text-slate-700 mb-1">{MOCK_WEATHER.temp}°</h2>
          <p className="text-slate-500 font-medium">{MOCK_WEATHER.condition}</p>
          <div className="flex gap-4 mt-4 text-xs text-slate-400 font-mono border-t border-slate-200/50 pt-3 w-full justify-center">
             <span>H: {MOCK_WEATHER.high}°</span>
             <span>L: {MOCK_WEATHER.low}°</span>
             <span>Wind: 12m/s</span>
          </div>
        </div>
      </GlassCard>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        <GlassCard className="flex flex-col justify-between h-32 cursor-pointer hover:bg-white/70 transition-colors">
          <div className="flex justify-between items-start">
             <div className="p-2 bg-purple-100/50 rounded-xl text-purple-700">
               <ArrowRightLeft size={20} />
             </div>
             <span className="text-xs text-slate-400 font-mono">RATE: 0.051</span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-slate-400">¥</span>
              <input 
                type="number" 
                value={jpy} 
                onChange={(e) => setJpy(Number(e.target.value))}
                className="w-16 bg-transparent font-serif text-xl text-slate-700 focus:outline-none border-b border-transparent focus:border-purple-300"
              />
            </div>
            <p className="text-sm font-medium text-slate-600">≈ ${(jpy * 0.051).toFixed(1)} HKD</p>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col justify-between h-32 cursor-pointer hover:bg-white/70 transition-colors relative overflow-hidden">
           {/* AI Badge */}
           <div className="absolute -right-3 -top-3 w-16 h-16 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full blur-xl opacity-40"></div>
           
           <div className="flex justify-between items-start z-10">
             <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl text-indigo-600">
               <Sparkles size={20} />
             </div>
           </div>
           <div className="z-10">
             <h3 className="font-serif text-slate-700 text-lg">Ask AI</h3>
             <p className="text-xs text-slate-500 leading-tight">"Where is the best ramen nearby?"</p>
           </div>
        </GlassCard>
      </div>

       {/* Map / Location Preview */}
       <div className="pt-2">
         <div className="flex justify-between items-center mb-3 px-1">
           <h3 className="font-serif text-lg text-slate-700">Near You</h3>
           <button className="text-xs text-slate-500 uppercase tracking-wider">View Map</button>
         </div>
         <div className="h-40 rounded-3xl bg-slate-200/50 relative overflow-hidden border border-white/40 shadow-inner">
             {/* Mock Map Visual */}
             <div className="absolute inset-0 opacity-40 mix-blend-multiply" style={{backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-orange-300 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
             </div>
             <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 shadow-sm flex items-center gap-1">
                <MapPin size={12} className="text-orange-400" /> Odori Park, 500m
             </div>
         </div>
       </div>
    </div>
  );
};

// --- View: Itinerary ---
const ItineraryView = () => {
  return (
    <div className="space-y-6 pb-24 animate-fade-in">
       <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif text-slate-800">Day 3</h1>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-full bg-white/50 border border-white flex items-center justify-center text-slate-400 hover:bg-white transition">
            <Camera size={18} />
          </button>
          <button className="w-10 h-10 rounded-full bg-orange-200/80 text-orange-800 border border-orange-200 flex items-center justify-center shadow-sm hover:scale-105 transition active:scale-95">
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Date Selector Scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {['22', '23', '24', '25', '26'].map((day, i) => (
          <button key={day} className={`flex flex-col items-center justify-center min-w-[3.5rem] h-16 rounded-2xl border transition-all duration-300 ${i === 2 ? 'bg-slate-700 text-white border-slate-700 shadow-lg scale-105' : 'bg-white/40 border-white/50 text-slate-500'}`}>
            <span className="text-[10px] font-medium uppercase opacity-80">Dec</span>
            <span className={`text-xl font-serif ${i === 2 ? 'text-white' : 'text-slate-700'}`}>{day}</span>
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative pl-4">
        {/* Vertical Line */}
        <div className="absolute left-[23px] top-4 bottom-0 w-[2px] bg-gradient-to-b from-slate-300/50 via-slate-300/50 to-transparent"></div>

        <div className="space-y-6">
          {MOCK_ITINERARY.map((item, index) => (
            <div key={item.id} className="relative flex gap-4 group">
               {/* Dot */}
               <div className="relative z-10 flex-shrink-0 mt-4">
                  <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${index === 0 ? 'bg-orange-300' : 'bg-slate-300'}`}></div>
               </div>
               
               {/* Card */}
               <GlassCard className="flex-1 py-4 px-5 hover:bg-white/80 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-slate-400 tracking-wide font-mono">{item.time}</span>
                    <button className="text-slate-300 hover:text-slate-500"><MoreHorizontal size={16}/></button>
                  </div>
                  <h3 className="font-serif text-lg text-slate-700 leading-tight mb-2">{item.title}</h3>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100/50 text-[10px] uppercase font-medium text-slate-500 border border-slate-200/50">
                      {item.type}
                    </span>
                    {/* Placeholder for tags */}
                  </div>
               </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- View: Checklist ---
const ChecklistView = () => {
  const [items, setItems] = useState(MOCK_CHECKLIST);

  const toggleItem = (catId, itemId) => {
    const newItems = items.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          items: cat.items.map(item => item.id === itemId ? {...item, checked: !item.checked} : item)
        };
      }
      return cat;
    });
    setItems(newItems);
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      <h1 className="text-3xl font-serif text-slate-800">Packing List</h1>
      
      {/* Progress Bar */}
      <div className="bg-white/40 rounded-full h-2 w-full overflow-hidden">
        <div className="bg-gradient-to-r from-purple-300 to-indigo-300 h-full w-[45%] rounded-full"></div>
      </div>

      {items.map(cat => (
        <div key={cat.id} className="space-y-3">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider pl-1">{cat.category}</h2>
          <div className="space-y-2">
            {cat.items.map(item => (
              <div 
                key={item.id} 
                onClick={() => toggleItem(cat.id, item.id)}
                className={`group flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  item.checked 
                  ? 'bg-slate-50/30 border-transparent opacity-60' 
                  : 'bg-white/60 border-white/60 shadow-sm backdrop-blur-sm'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                  item.checked ? 'bg-slate-400 border-slate-400' : 'border-slate-300 group-hover:border-purple-300'
                }`}>
                  {item.checked && <Sparkles size={12} className="text-white" />}
                </div>
                <span className={`font-medium ${item.checked ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-700'}`}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Add New Item Button (Floating Style but inline for demo) */}
      <button className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-300 text-slate-400 font-medium hover:border-slate-400 hover:text-slate-500 transition-colors flex items-center justify-center gap-2">
        <Plus size={18} /> Add Item
      </button>
    </div>
  );
};

// --- View: Flight ---
const FlightView = () => {
  return (
    <div className="space-y-6 pb-24 animate-fade-in flex flex-col h-[80vh] justify-center">
      <h1 className="text-3xl font-serif text-slate-800 mb-4">Boarding Pass</h1>
      
      {/* Ticket Card */}
      <div className="relative bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white overflow-hidden">
        {/* Header Color Strip */}
        <div className="h-2 bg-gradient-to-r from-purple-300 to-indigo-300 w-full"></div>
        
        <div className="p-6 pb-8">
           <div className="flex justify-between items-center mb-8">
             <span className="font-mono text-sm text-slate-400">CX580</span>
             <span className="font-mono text-sm text-orange-400 border border-orange-200 bg-orange-50 px-2 py-0.5 rounded">BUSINESS</span>
           </div>

           <div className="flex justify-between items-center mb-2">
             <div className="text-left">
               <p className="text-4xl font-serif text-slate-800">HKG</p>
               <p className="text-xs text-slate-500 uppercase tracking-wide">Hong Kong</p>
             </div>
             <div className="flex flex-col items-center flex-1 px-4">
               <Plane className="text-slate-300 rotate-90 mb-1" size={20} />
               <div className="h-px w-full bg-slate-200 relative">
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-slate-300 rounded-full"></div>
               </div>
               <p className="text-[10px] text-slate-400 mt-1">4h 45m</p>
             </div>
             <div className="text-right">
               <p className="text-4xl font-serif text-slate-800">CTS</p>
               <p className="text-xs text-slate-500 uppercase tracking-wide">Sapporo</p>
             </div>
           </div>
        </div>

        {/* Perforation visual */}
        <div className="relative h-8 bg-slate-50 flex items-center justify-between px-[-10px]">
           <div className="w-6 h-6 bg-slate-200 rounded-full -ml-3 shadow-inner"></div>
           <div className="w-full border-t-2 border-dashed border-slate-300 mx-2"></div>
           <div className="w-6 h-6 bg-slate-200 rounded-full -mr-3 shadow-inner"></div>
        </div>

        <div className="p-6 pt-8 bg-slate-50/50">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-xs text-slate-400 uppercase mb-1">Date</p>
              <p className="font-medium text-slate-700">Dec 24</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase mb-1">Time</p>
              <p className="font-medium text-slate-700">09:20</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase mb-1">Gate</p>
              <p className="font-medium text-slate-700">62</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase mb-1">Seat</p>
              <p className="font-medium text-slate-700">12A</p>
            </div>
          </div>
          
          {/* Barcode Mockup */}
          <div className="w-full h-12 bg-slate-800 opacity-10 rounded mb-2"></div>
          <p className="text-center text-[10px] text-slate-400 font-mono">TICKET #8293041932</p>
        </div>
      </div>
      
      <button className="mx-auto flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition">
        <Sparkles size={14} /> Add to Apple Wallet
      </button>
    </div>
  );
};

// --- Main App Shell ---

export default function WinterTravelApp() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="relative min-h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
      
      {/* Dynamic Backgrounds */}
      <div className="fixed inset-0 z-0">
         {/* Main Gradient */}
         <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200"></div>
         {/* Subtle Orbs for "Northern Lights" feel */}
         <div className="absolute top-0 left-0 w-full h-2/3 bg-gradient-to-b from-purple-100/30 to-transparent mix-blend-overlay"></div>
         <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-3xl filter"></div>
         <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-teal-100/20 rounded-full blur-3xl filter"></div>
      </div>

      {/* Canvas Snow Effect */}
      <SnowEffect />

      {/* Main Content Area */}
      <main className="relative z-10 max-w-md mx-auto min-h-screen p-6">
        
        {/* Render Active View */}
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'trips' && <ItineraryView />}
        {activeTab === 'pack' && <ChecklistView />}
        {activeTab === 'flight' && <FlightView />}

      </main>

      {/* Bottom Navigation */}
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Global CSS for utilities not in Tailwind standard but needed for specific vibe */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');
        
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        
        /* Hide scrollbar for horizontal lists */
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom, 20px);
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}