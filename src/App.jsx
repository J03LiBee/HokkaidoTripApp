/**
 * Main Application Component
 * Orchestrates all views and manages application state
 */

import React, { useState } from 'react';
import { useAuth } from '@hooks/useAuth';
import { useFirestoreCollection } from '@hooks/useFirestoreCollection';
import { updateDocument, deleteDocument, addDocument } from '@services/firestore';
import { INITIAL_ITINERARY, INITIAL_CHECKLIST, INITIAL_BUDGET } from '@constants/initialData';

// Components
import Snowfall from '@components/common/Snowfall';
import Header from '@components/layout/Header';
import BottomNav from '@components/layout/BottomNav';
import Dashboard from '@components/views/Dashboard';
import ItineraryTable from '@components/views/ItineraryTable';
import ChecklistView from '@components/views/ChecklistView';
import BudgetView from '@components/views/BudgetView';
import EventModal from '@components/modals/EventModal';
import LoginScreen from '@components/auth/LoginScreen';

function App() {
  const { user, isLoading: authLoading, signInWithGoogle, signInAnonymous, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  
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

  // Data from Firestore
  const { data: itinerary, isLoading: itineraryLoading } = useFirestoreCollection(
    user, 
    'itinerary', 
    INITIAL_ITINERARY
  );
  const { data: checklist } = useFirestoreCollection(user, 'checklist', INITIAL_CHECKLIST);
  const { data: budget } = useFirestoreCollection(user, 'budget', INITIAL_BUDGET);

  // Handlers
  const handleSlotClick = (date, time, existingEvent) => {
    if (existingEvent) {
      setEditingEvent(existingEvent);
      setNewEvent({ ...existingEvent });
    } else {
      setEditingEvent(null);
      setNewEvent({ 
        date, 
        time, 
        title: '', 
        location: '', 
        type: 'activity', 
        notes: '' 
      });
    }
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = async () => {
    if (!user) return;
    try {
      if (editingEvent) {
        await updateDocument(user.uid, 'itinerary', editingEvent.id, newEvent);
      } else {
        await addDocument(user.uid, 'itinerary', newEvent);
      }
      setIsEventModalOpen(false);
    } catch (e) { 
      console.error('Failed to save event:', e); 
    }
  };

  const handleDeleteEvent = async () => {
    if (!user || !editingEvent || !window.confirm('確定要刪除此行程？')) return;
    try {
      await deleteDocument(user.uid, 'itinerary', editingEvent.id);
      setIsEventModalOpen(false);
    } catch (e) { 
      console.error('Failed to delete event:', e); 
    }
  };

  const handleToggleCheck = async (item) => {
    if (!user) return;
    try {
      await updateDocument(user.uid, 'checklist', item.id, { 
        checked: !item.checked 
      });
    } catch (e) { 
      console.error('Failed to update checklist:', e); 
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-blue-400">
        <div className="text-center">
          <div className="text-xl mb-2">❄️</div>
          <div>載入中...</div>
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-blue-400">
        <div className="text-center">
          <div className="text-xl mb-2">❄️</div>
          <div>載入資料中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-20 relative selection:bg-blue-500/30">
      <Snowfall />

      <Header 
        activeTab={activeTab} 
        onAddEvent={() => handleSlotClick('2025-12-31', '12:00', null)}
        user={user}
        onSignOut={signOut}
      />

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
          <ItineraryTable 
            itinerary={itinerary} 
            onEditSlot={handleSlotClick} 
          />
        )}

        {activeTab === 'checklist' && (
          <ChecklistView 
            checklist={checklist}
            onToggleCheck={handleToggleCheck}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetView budget={budget} />
        )}
      </main>

      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <EventModal 
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
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

