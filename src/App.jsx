/**
 * Main Application Component
 * Orchestrates all views and manages application state
 */

import React, { useState } from 'react';
import { useAuth } from '@hooks/useAuth';
import { useFirestoreCollection } from '@hooks/useFirestoreCollection';
import useSharedCollection from '@hooks/useSharedCollection';
import { 
  updateDocument, 
  deleteDocument, 
  addDocument,
  updateSharedDocument,
  deleteSharedDocument,
  addSharedDocument
} from '@services/firestore';
import { INITIAL_ITINERARY, INITIAL_CHECKLIST, INITIAL_BUDGET, INITIAL_EXPENSES } from '@constants/initialData';

// Components
import EnhancedSnowfall from '@components/common/EnhancedSnowfall';
import Header from '@components/layout/Header';
import BottomNav from '@components/layout/BottomNav';
import Dashboard from '@components/views/Dashboard';
import ItineraryTimeline from '@components/views/ItineraryTimeline';
import ChecklistView from '@components/views/ChecklistView';
import ExpenseTracker from '@components/views/ExpenseTracker';
import EventModal from '@components/modals/EventModal';
import EventDetailModal from '@components/modals/EventDetailModal';
import LoginScreen from '@components/auth/LoginScreen';

function App() {
  const { user, isLoading: authLoading, signInWithGoogle, signInAnonymous, signOut, isAnonymous } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Modal States
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isEventDetailModalOpen, setIsEventDetailModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingEvent, setViewingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    date: '2025-12-31',
    time: '12:00',
    title: '',
    location: '',
    type: 'activity',
    notes: '',
    mapLink: '',
    imageUrl: ''
  });

  // Data from Firestore
  // SHARED DATA (all users can see and edit)
  const { data: itinerary, loading: itineraryLoading } = useSharedCollection('itinerary', INITIAL_ITINERARY);
  const { data: expenses } = useSharedCollection('expenses', INITIAL_EXPENSES);
  const { data: budget } = useSharedCollection('budget', INITIAL_BUDGET);
  const { data: sharedChecklist } = useSharedCollection('sharedChecklist', []);
  
  // USER-SPECIFIC DATA (only this user can see)
  const { data: personalChecklist } = useFirestoreCollection(user, 'checklist', INITIAL_CHECKLIST);

  // Handlers
  const handleEventClick = (event) => {
    // Click on existing event -> show preview modal
    setViewingEvent(event);
    setIsEventDetailModalOpen(true);
  };

  const handleEditEvent = () => {
    // Guest cannot edit - 訪客不能編輯
    if (isAnonymous) {
      alert('訪客模式無法編輯行程，請使用 Google 登入');
      return;
    }
    
    // From preview modal, switch to edit mode
    if (viewingEvent) {
      setEditingEvent(viewingEvent);
      setNewEvent({ ...viewingEvent });
      setIsEventDetailModalOpen(false);
      setIsEventModalOpen(true);
    }
  };

  const handleAddNewEvent = (date = '2025-12-31', time = '12:00') => {
    // Guest cannot add - 訪客不能新增
    if (isAnonymous) {
      alert('訪客模式無法新增行程，請使用 Google 登入');
      return;
    }
    
    // Add new event
    setEditingEvent(null);
    setNewEvent({ 
      date, 
      time, 
      title: '', 
      location: '', 
      type: 'activity', 
      notes: '',
      mapLink: '',
      imageUrl: ''
    });
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = async () => {
    if (!user) return;
    try {
      if (editingEvent) {
        // Update shared itinerary
        await updateSharedDocument('itinerary', editingEvent.id, newEvent);
      } else {
        // Add to shared itinerary
        await addSharedDocument('itinerary', newEvent);
      }
      setIsEventModalOpen(false);
      setEditingEvent(null);
    } catch (e) { 
      console.error('Failed to save event:', e); 
    }
  };

  const handleDeleteEvent = async () => {
    if (!user || !editingEvent || !window.confirm('確定要刪除此行程？')) return;
    try {
      // Delete from shared itinerary
      await deleteSharedDocument('itinerary', editingEvent.id);
      setIsEventModalOpen(false);
      setEditingEvent(null);
    } catch (e) { 
      console.error('Failed to delete event:', e); 
    }
  };

  // Personal Checklist Handlers
  const handleTogglePersonal = async (item) => {
    if (!user) return;
    try {
      await updateDocument(user.uid, 'checklist', item.id, { 
        checked: !item.checked 
      });
    } catch (e) { 
      console.error('Failed to update personal checklist:', e); 
    }
  };

  const handleAddPersonal = async (itemData) => {
    if (!user) return;
    try {
      await addDocument(user.uid, 'checklist', itemData);
    } catch (e) {
      console.error('Failed to add personal checklist item:', e);
    }
  };

  const handleUpdatePersonal = async (itemId, itemData) => {
    if (!user) return;
    try {
      await updateDocument(user.uid, 'checklist', itemId, itemData);
    } catch (e) {
      console.error('Failed to update personal checklist item:', e);
    }
  };

  const handleDeletePersonal = async (itemId) => {
    if (!user) return;
    try {
      await deleteDocument(user.uid, 'checklist', itemId);
    } catch (e) {
      console.error('Failed to delete personal checklist item:', e);
    }
  };

  // Shared Checklist Handlers
  const handleToggleShared = async (item) => {
    if (!user) return;
    try {
      await updateSharedDocument('sharedChecklist', item.id, { 
        checked: !item.checked 
      });
    } catch (e) { 
      console.error('Failed to update shared checklist:', e); 
    }
  };

  const handleAddShared = async (itemData) => {
    if (!user) return;
    try {
      await addSharedDocument('sharedChecklist', itemData);
    } catch (e) {
      console.error('Failed to add shared checklist item:', e);
    }
  };

  const handleUpdateShared = async (itemId, itemData) => {
    if (!user) return;
    try {
      await updateSharedDocument('sharedChecklist', itemId, itemData);
    } catch (e) {
      console.error('Failed to update shared checklist item:', e);
    }
  };

  const handleDeleteShared = async (itemId) => {
    if (!user) return;
    try {
      await deleteSharedDocument('sharedChecklist', itemId);
    } catch (e) {
      console.error('Failed to delete shared checklist item:', e);
    }
  };

  const handleAddExpense = async (expenseData) => {
    if (!user) return;
    try {
      // Add to shared expenses
      await addSharedDocument('expenses', expenseData);
    } catch (e) {
      console.error('Failed to add expense:', e);
    }
  };

  const handleUpdateExpense = async (expenseId, expenseData) => {
    if (!user) return;
    try {
      // Update shared expense
      await updateSharedDocument('expenses', expenseId, expenseData);
    } catch (e) {
      console.error('Failed to update expense:', e);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!user || !window.confirm('確定要刪除此支出？')) return;
    try {
      // Delete from shared expenses
      await deleteSharedDocument('expenses', expenseId);
    } catch (e) {
      console.error('Failed to delete expense:', e);
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center text-slate-600">
        <div className="text-center">
          <div className="text-5xl mb-3 animate-bounce">❄️</div>
          <div className="font-serif text-xl text-slate-700">Loading...</div>
        </div>
      </div>
    );
  }

  // Login screen - if no user is signed in
  if (!user) {
    return (
      <LoginScreen 
        onGoogleSignIn={signInWithGoogle}
        onAnonymousSignIn={signInAnonymous}
      />
    );
  }

  // Show loading for data after user is authenticated
  if (itineraryLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center text-slate-600">
        <div className="text-center">
          <div className="text-5xl mb-3 animate-bounce">❄️</div>
          <div className="font-serif text-xl text-slate-700">載入資料中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
      {/* Dynamic Backgrounds - Darker Version */}
      <div className="fixed inset-0 z-0">
        {/* Main Gradient - Darker */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300"></div>
        {/* Subtle Orbs for "Northern Lights" feel */}
        <div className="absolute top-0 left-0 w-full h-2/3 bg-gradient-to-b from-purple-200/40 to-transparent mix-blend-overlay"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-300/30 rounded-full blur-3xl"></div>
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-teal-200/30 rounded-full blur-3xl"></div>
      </div>

      <EnhancedSnowfall />

      <Header 
        activeTab={activeTab} 
        onAddEvent={() => handleAddNewEvent()}
        user={user}
        onSignOut={signOut}
      />

      <main className="relative z-10 max-w-md mx-auto min-h-screen p-6 pt-20">
        {activeTab === 'dashboard' && (
          <Dashboard 
            itinerary={itinerary} 
            budget={budget}
            personalChecklist={personalChecklist}
            sharedChecklist={sharedChecklist}
            onNavigate={setActiveTab} 
          />
        )}

        {activeTab === 'itinerary' && (
          <ItineraryTimeline 
            itinerary={itinerary} 
            onEventClick={handleEventClick} 
          />
        )}

        {activeTab === 'checklist' && (
          <ChecklistView 
            personalChecklist={personalChecklist}
            sharedChecklist={sharedChecklist}
            onTogglePersonal={handleTogglePersonal}
            onToggleShared={handleToggleShared}
            onAddPersonal={handleAddPersonal}
            onAddShared={handleAddShared}
            onUpdatePersonal={handleUpdatePersonal}
            onUpdateShared={handleUpdateShared}
            onDeletePersonal={handleDeletePersonal}
            onDeleteShared={handleDeleteShared}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpenseTracker 
            expenses={expenses}
            onAddExpense={handleAddExpense}
            onUpdateExpense={handleUpdateExpense}
            onDeleteExpense={handleDeleteExpense}
            itinerary={itinerary}
          />
        )}
      </main>

      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isAnonymous={isAnonymous}
      />

      {/* Modals should be at the end for proper z-index */}

      <EventDetailModal
        isOpen={isEventDetailModalOpen}
        onClose={() => {
          setIsEventDetailModalOpen(false);
          setViewingEvent(null);
        }}
        event={viewingEvent}
        onEdit={handleEditEvent}
      />

      <EventModal 
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setEditingEvent(null);
        }}
        event={newEvent}
        isEditing={!!editingEvent}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        onChange={setNewEvent}
      />
    </div>
  );
}

export default App;

