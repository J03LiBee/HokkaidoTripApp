/**
 * Firestore Database Operations
 * Provides reusable functions for database CRUD operations
 */

import { 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  writeBatch 
} from 'firebase/firestore';
import { db, appId } from './firebase';

/**
 * Get collection reference for a user
 */
export const getUserCollection = (uid, collectionName) => {
  return collection(db, 'artifacts', appId, 'users', uid, collectionName);
};

/**
 * Subscribe to a collection with real-time updates
 * @param {string} uid - User ID
 * @param {string} collectionName - Collection name
 * @param {Array} initialData - Initial data to seed if collection is empty
 * @param {Function} callback - Callback function to handle data updates
 * @returns {Function} Unsubscribe function
 */
export const subscribeToCollection = (uid, collectionName, initialData, callback) => {
  const colRef = getUserCollection(uid, collectionName);
  
  return onSnapshot(colRef, async (snapshot) => {
    if (snapshot.empty && initialData && initialData.length > 0) {
      // Seed initial data
      const batch = writeBatch(db);
      initialData.forEach(item => {
        const docRef = doc(colRef);
        batch.set(docRef, item);
      });
      await batch.commit();
    } else {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(data);
    }
  });
};

/**
 * Add a document to a collection
 */
export const addDocument = async (uid, collectionName, data) => {
  const colRef = getUserCollection(uid, collectionName);
  return await addDoc(colRef, data);
};

/**
 * Update a document
 */
export const updateDocument = async (uid, collectionName, docId, data) => {
  const docRef = doc(db, 'artifacts', appId, 'users', uid, collectionName, docId);
  return await updateDoc(docRef, data);
};

/**
 * Delete a document
 */
export const deleteDocument = async (uid, collectionName, docId) => {
  const docRef = doc(db, 'artifacts', appId, 'users', uid, collectionName, docId);
  return await deleteDoc(docRef);
};

