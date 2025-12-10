/**
 * Custom hook for Firestore collection subscriptions
 */

import { useState, useEffect } from 'react';
import { subscribeToCollection } from '@services/firestore';

export const useFirestoreCollection = (user, collectionName, initialData = []) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToCollection(
      user.uid, 
      collectionName, 
      initialData,
      (newData) => {
        setData(newData);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, collectionName]); // Note: initialData should remain stable

  return { data, isLoading };
};

