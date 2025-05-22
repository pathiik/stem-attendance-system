import { createContext, useContext, useState, useCallback } from "react";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  getFirestore,
  getCountFromServer,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import { app } from "../firebase/config";

// Firebase Context for managing Firestore operations
const FirebaseContext = createContext();

// FirebaseProvider component that manages Firestore operations
export function FirebaseProvider({ children }) {
  const [loading, setLoading] = useState(false); // State for loading status
  const [error, setError] = useState(null); // State for error messages
  const db = getFirestore(app); // Initialize Firestore instance

  // Clear error messages after a delay of 5 seconds
  const clearError = useCallback(() => {
    const timer = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Subscribes to real-time collection updates
  const getCollection = useCallback(
    (path, callback, options = {}) => {
      try {
        setLoading(true);
        setError(null);

        let q = collection(db, path);

        // Apply ordering if specified
        if (options.orderByField) {
          q = query(
            q,
            orderBy(options.orderByField, options.orderDirection || "asc")
          );
        }

        // Apply where conditions if specified
        if (options.whereConditions) {
          options.whereConditions.forEach((condition) => {
            q = query(q, where(...condition));
          });
        }

        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            callback(data);
            setLoading(false);
          },
          (err) => {
            setError(`Failed to fetch data: ${err.message}`);
            clearError();
            setLoading(false);
          }
        );

        return unsubscribe;
      } catch (err) {
        setError(`Failed to initialize query: ${err.message}`);
        clearError();
        setLoading(false);
        throw err;
      }
    },
    [db, clearError]
  );

  // Gets paginated collection data
  const getCollectionPaginated = useCallback(
    async (path, page = 1, itemsPerPage = 10, options = {}) => {
      try {
        setLoading(true);
        setError(null);

        let q = collection(db, path);

        // Apply query options if specified
        if (options.orderByField) {
          q = query(
            q,
            orderBy(options.orderByField, options.orderDirection || "asc")
          );
        }

        if (options.whereConditions) {
          options.whereConditions.forEach((condition) => {
            q = query(q, where(...condition));
          });
        }

        // Calculate pagination offset
        const offset = (page - 1) * itemsPerPage;
        let paginatedQuery = q;

        // Handle pagination for pages after the first
        if (page > 1) {
          const previousQuery = query(q, limit(offset));
          const snapshot = await getDocs(previousQuery);
          const lastVisible = snapshot.docs[snapshot.docs.length - 1];
          paginatedQuery = query(
            q,
            startAfter(lastVisible),
            limit(itemsPerPage)
          );
        } else {
          paginatedQuery = query(q, limit(itemsPerPage));
        }

        const snapshot = await getDocs(paginatedQuery);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLoading(false);
        return { data, error: null };
      } catch (err) {
        setError(`Failed to fetch paginated data: ${err.message}`);
        clearError();
        setLoading(false);
        return { data: [], error: err };
      }
    },
    [db, clearError]
  );

  // Gets count of documents in a collection with optional conditions
  const getCollectionCount = useCallback(
    async (path, conditions) => {
      try {
        setLoading(true);
        setError(null);

        let q = collection(db, path);

        if (conditions) {
          conditions.forEach((condition) => {
            q = query(q, where(...condition));
          });
        }

        const snapshot = await getCountFromServer(q);
        setLoading(false);
        return snapshot.data().count;
      } catch (err) {
        setError(`Failed to get document count: ${err.message}`);
        clearError();
        setLoading(false);
        return 0;
      }
    },
    [db, clearError]
  );

  // Creates a new document with auto-generated ID
  const createDoc = useCallback(
    async (path, data) => {
      try {
        setLoading(true);
        setError(null);
        const docRef = await addDoc(collection(db, path), data);
        return docRef.id;
      } catch (err) {
        setError(`Failed to create document: ${err.message}`);
        clearError();
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [db, clearError]
  );

  // Sets a document with specific ID (creates or overwrites)
  const setDocWithId = useCallback(
    async (path, id, data) => {
      try {
        setLoading(true);
        setError(null);
        await setDoc(doc(db, path, id), data);
        return id;
      } catch (err) {
        setError(`Failed to set document: ${err.message}`);
        clearError();
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [db, clearError]
  );

  // Updates an existing document
  const updateDocData = useCallback(
    async (path, id, updates) => {
      try {
        setLoading(true);
        setError(null);
        await updateDoc(doc(db, path, id), updates);
      } catch (err) {
        setError(`Failed to update document: ${err.message}`);
        clearError();
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [db, clearError]
  );

  // Deletes a document
  const deleteDocData = useCallback(
    async (path, id) => {
      try {
        setLoading(true);
        setError(null);
        await deleteDoc(doc(db, path, id));
      } catch (err) {
        setError(`Failed to delete document: ${err.message}`);
        clearError();
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [db, clearError]
  );

  // Context value containing all Firestore operations
  const value = {
    db,
    getCollection,
    getCollectionPaginated,
    getCollectionCount,
    createDoc,
    setDocWithId,
    updateDocData,
    deleteDocData,
    loading,
    error,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

// Custom hook to access Firebase context
export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within FirebaseProvider");
  }
  return context;
};
