import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

const SAVED_ITEMS_STORAGE_KEY = "ztech_saved_items";

export type SavedItem = {
  id: string;
  title: string;
  price: number;
  image?: string | null;
};

type SavedItemsContextType = {
  savedItems: SavedItem[];
  addToSavedItems: (item: SavedItem) => void;
  removeFromSavedItems: (id: string) => void;
  clearSavedItems: () => void;
  isSaved: (id: string) => boolean;
  savedCount: number;
};

const SavedItemsContext = createContext<SavedItemsContextType | undefined>(undefined);

export function useSavedItems() {
  const ctx = useContext(SavedItemsContext);
  if (!ctx) throw new Error("useSavedItems must be used within a SavedItemsProvider");
  return ctx;
}

function loadSavedItemsFromStorage(): SavedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(SAVED_ITEMS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Failed to load saved items from storage:", error);
  }
  return [];
}

function saveItemsToStorage(items: SavedItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SAVED_ITEMS_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save saved items to storage:", error);
  }
}

export const SavedItemsProvider = ({ children }: { children: ReactNode }) => {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedItems = loadSavedItemsFromStorage();
    setSavedItems(storedItems);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveItemsToStorage(savedItems);
    }
  }, [savedItems, isLoaded]);

  const savedCount = savedItems.length;

  function addToSavedItems(item: SavedItem) {
    setSavedItems(prev =>
      prev.some(i => i.id === item.id) ? prev : [...prev, item]
    );
  }

  function removeFromSavedItems(id: string) {
    setSavedItems(prev => prev.filter(i => i.id !== id));
  }

  function clearSavedItems() {
    setSavedItems([]);
  }

  function isSaved(id: string) {
    return savedItems.some(i => i.id === id);
  }

  return (
    <SavedItemsContext.Provider value={{ 
      savedItems, 
      addToSavedItems, 
      removeFromSavedItems, 
      clearSavedItems, 
      isSaved,
      savedCount 
    }}>
      {children}
    </SavedItemsContext.Provider>
  );
};
