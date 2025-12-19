/**
 * Custom Hook: useSharedCollection
 * Subscribe to a SHARED Firestore collection (accessible by all users)
 */

import { useState, useEffect } from 'react';
import { subscribeToSharedCollection } from '@services/firestore';

const useSharedCollection = (collectionName, initialData = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = subscribeToSharedCollection(
      collectionName,
      initialData,
      (newData) => {
        setData(newData);
        setLoading(false);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [collectionName]);

  return { data, loading, error };
};

export default useSharedCollection;


