/**
 * Initial seed data for the application
 * Used when user has no data in Firebase
 */

export const INITIAL_ITINERARY = [
  { 
    date: '2025-12-31', 
    time: '14:00', 
    title: '抵達北海道', 
    location: '新千歲機場', 
    type: 'transport', 
    notes: '搭車前往市區',
    mapLink: '',
    imageUrl: ''
  },
  { 
    date: '2025-12-31', 
    time: '16:00', 
    title: 'Check-in', 
    location: '札幌酒店', 
    type: 'stay', 
    notes: '',
    mapLink: '',
    imageUrl: ''
  },
  { 
    date: '2025-12-31', 
    time: '17:00', 
    title: '狸小路商店街', 
    location: '狸小路', 
    type: 'activity', 
    notes: '晚餐/逛街',
    mapLink: '',
    imageUrl: ''
  },
  { 
    date: '2026-01-01', 
    time: '11:00', 
    title: '初詣', 
    location: '北海道神宮', 
    type: 'activity', 
    notes: '新年參拜',
    mapLink: '',
    imageUrl: ''
  },
  { 
    date: '2026-01-01', 
    time: '13:00', 
    title: 'Toriton 壽司', 
    location: 'Toriton', 
    type: 'food', 
    notes: '要排兩個鐘',
    mapLink: '',
    imageUrl: ''
  },
  { 
    date: '2026-01-02', 
    time: '08:00', 
    title: '旭川一日遊', 
    location: '旭川', 
    type: 'activity', 
    notes: '動物園',
    mapLink: '',
    imageUrl: ''
  },
  { 
    date: '2026-01-03', 
    time: '10:00', 
    title: '前往小樽', 
    location: 'JR 札幌站', 
    type: 'transport', 
    notes: '',
    mapLink: '',
    imageUrl: ''
  },
  { 
    date: '2026-01-03', 
    time: '12:00', 
    title: '三角市場', 
    location: '小樽', 
    type: 'food', 
    notes: '海鮮丼',
    mapLink: '',
    imageUrl: ''
  },
];

export const INITIAL_CHECKLIST = [
  { id: '1', text: '護照 (Passport)', checked: false, category: '重要' },
  { id: '2', text: '日元現金 / Credit Card', checked: false, category: '重要' },
  { id: '3', text: 'VJW QR Code', checked: false, category: '重要' },
  { id: '4', text: 'SIM 卡', checked: false, category: '電子' },
  { id: '5', text: '冰爪 (雪地防滑)', checked: false, category: '衣物' },
];

export const INITIAL_BUDGET = [
  { id: '1', item: '機票', amount: 5580, payer: 'Jason', status: '已結算' },
  { id: '2', item: '一日團', amount: 588, payer: 'Jason', status: '未支付' },
];

export const INITIAL_EXPENSES = [];

export const TRIP_DATES = [
  '2025-12-31', '2026-01-01', '2026-01-02', '2026-01-03', 
  '2026-01-04', '2026-01-05', '2026-01-06', '2026-01-07', '2026-01-08'
];

export const TIME_SLOTS = Array.from({ length: 16 }, (_, i) => i + 8); // 08:00 to 23:00

export const EVENT_TYPES = {
  ACTIVITY: 'activity',
  FOOD: 'food',
  TRANSPORT: 'transport',
  STAY: 'stay',
};

export const CHECKLIST_CATEGORIES = ['重要', '衣物', '電子'];
