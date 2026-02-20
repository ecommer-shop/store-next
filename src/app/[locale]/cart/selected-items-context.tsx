'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface SelectedItemsContextType {
  selectedLineIds: string[];
  toggleLineId: (lineId: string) => void;
  setSelectedLineIds: (ids: string[]) => void;
  areAllSelected: (totalLines: number) => boolean;
  toggleAllLines: (lineIds: string[]) => void;
  // initialize default selection for first visit (won't overwrite persisted selection)
  initializeDefaultSelection: (lineIds: string[]) => void;
}

const SelectedItemsContext = createContext<SelectedItemsContextType | null>(null);

function storageKeyForOrder(orderId: string | null | undefined) {
  return orderId ? `selected-lines:${orderId}` : 'selected-lines:unknown';
}

export function SelectedItemsProvider({ children, orderId, initialSelectedIds }: { children: ReactNode; orderId?: string | null; initialSelectedIds?: string[] | null }) {
  const [selectedLineIds, setSelectedLineIds] = useState<string[]>(() => {
    try {
      if (Array.isArray(initialSelectedIds)) {
        return initialSelectedIds;
      }
      let id = orderId ?? null;
      if (!id && typeof window !== 'undefined') {
        id = localStorage.getItem('activeOrderId');
      }
      if (!id) return [];
      const raw = typeof window !== 'undefined' ? localStorage.getItem(storageKeyForOrder(id)) : null;
      const parsed = raw ? JSON.parse(raw) : null;
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  const [initialized, setInitialized] = useState<boolean>(() => {
    try {
      if (Array.isArray(initialSelectedIds)) return true;
      const id = orderId ?? (typeof window !== 'undefined' ? localStorage.getItem('activeOrderId') : null);
      if (!id) return false;
      return !!localStorage.getItem(`selected-lines-initialized:${id}`);
    } catch (e) {
      return false;
    }
  });

  // If orderId changes, reload selection for new orderId
  useEffect(() => {
    if (!orderId) return;
    try {
      const raw = localStorage.getItem(storageKeyForOrder(orderId));
      const parsed = raw ? JSON.parse(raw) : null;
      setSelectedLineIds(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      setSelectedLineIds([]);
    }
  }, [orderId]);

  // Persist selection when it changes (localStorage, cookie)
  useEffect(() => {
    let id = orderId ?? null;
    try {
      if (!id && typeof window !== 'undefined') {
        id = localStorage.getItem('activeOrderId');
      }
    } catch (e) {
      id = id ?? null;
    }
    if (!id) return;
    try {
      const key = storageKeyForOrder(id);
      localStorage.setItem(key, JSON.stringify(selectedLineIds));
      // also set a cookie so server-side code can read selection if needed
      if (typeof document !== 'undefined') {
        const cookieName = `selectedLines_${id}`;
        const cookieValue = encodeURIComponent(JSON.stringify(selectedLineIds));
        document.cookie = `${cookieName}=${cookieValue}; path=/; max-age=${60 * 60 * 24 * 365}`;
      }
    } catch (e) {
      // noop
    }
  }, [orderId, selectedLineIds]);

  const initializeDefaultSelection = (lineIds: string[]) => {
    try {
      const id = orderId ?? (typeof window !== 'undefined' ? localStorage.getItem('activeOrderId') : null);
      if (!id) {
        // if no orderId, just set selection locally once
        if (!initialized) {
          setSelectedLineIds(lineIds);
          setInitialized(true);
        }
        return;
      }

      // Do not overwrite if already initialized or there is an existing selection
      const key = storageKeyForOrder(id);
      const existing = localStorage.getItem(key);
      if (existing) {
        setInitialized(true);
        return;
      }

      if (!initialized) {
        setSelectedLineIds(lineIds);
        localStorage.setItem(`selected-lines-initialized:${id}`, '1');
        setInitialized(true);
      }
    } catch (e) {
      // noop
    }
  };

  const toggleLineId = (lineId: string) => {
    setSelectedLineIds((prev) =>
      prev.includes(lineId) ? prev.filter((id) => id !== lineId) : [...prev, lineId]
    );
  };

  const areAllSelected = (totalLines: number) => {
    return selectedLineIds.length === totalLines && totalLines > 0;
  };

  const toggleAllLines = (lineIds: string[]) => {
    if (areAllSelected(lineIds.length)) {
      setSelectedLineIds([]);
    } else {
      setSelectedLineIds(lineIds);
    }
  };

  return (
    <SelectedItemsContext.Provider
      value={{
        selectedLineIds,
        toggleLineId,
        setSelectedLineIds,
        areAllSelected,
        toggleAllLines,
        initializeDefaultSelection,
      }}
    >
      {children}
    </SelectedItemsContext.Provider>
  );
}

export function useSelectedItems() {
  const context = useContext(SelectedItemsContext);
  if (!context) {
    throw new Error('useSelectedItems must be used within SelectedItemsProvider');
  }
  return context;
}
