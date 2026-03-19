import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import type { TravelEntry } from "../types/entry";
import { STORAGE_KEYS } from "../types/storage";
import { safeGetJson, safeSetJson } from "../utils/storage";
import { persistImageToAppStorage, safeDeleteFile } from "../utils/files";
import { createId } from "../utils/id";

export interface CreateEntryInput {
  imageUri: string;
  address: string;
  coords: TravelEntry["coords"];
}

export interface EntryContextValue {
  entries: readonly TravelEntry[];
  isHydrating: boolean;
  addEntry: (input: CreateEntryInput) => Promise<TravelEntry | null>;
  removeEntry: (id: string) => Promise<boolean>;
  reload: () => Promise<void>;
}

export const EntryContext = createContext<EntryContextValue | undefined>(undefined);

function isValidEntryShape(x: unknown): x is TravelEntry {
  if (!x || typeof x !== "object") return false;
  const e = x as Partial<TravelEntry>;
  return (
    typeof e.id === "string" &&
    typeof e.imageUri === "string" &&
    typeof e.address === "string" &&
    typeof e.createdAt === "number"
  );
}

export function EntryProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const [isHydrating, setIsHydrating] = useState<boolean>(true);

  const reload = useCallback(async () => {
    setIsHydrating(true);
    const saved = await safeGetJson<unknown>(STORAGE_KEYS.entries);
    if (!saved) {
      setEntries([]);
      setIsHydrating(false);
      return;
    }

    if (!Array.isArray(saved)) {
      setEntries([]);
      setIsHydrating(false);
      return;
    }

    const parsed = saved.filter(isValidEntryShape);
    setEntries(parsed);
    setIsHydrating(false);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const persist = useCallback(async (next: TravelEntry[]): Promise<boolean> => {
    return await safeSetJson(STORAGE_KEYS.entries, next);
  }, []);

  const addEntry = useCallback(
    async (input: CreateEntryInput): Promise<TravelEntry | null> => {
      try {
        const persistedImageUri = await persistImageToAppStorage(input.imageUri);
        const entry: TravelEntry = {
          id: createId(),
          imageUri: persistedImageUri,
          address: input.address,
          coords: input.coords ?? null,
          createdAt: Date.now(),
        };

        const next = [entry, ...entries];
        const ok = await persist(next);
        if (!ok) {
          // Roll back file copy if saving fails.
          await safeDeleteFile(persistedImageUri);
          return null;
        }
        setEntries(next);
        return entry;
      } catch (e) {
        Alert.alert("Save failed", "Unable to save this entry. Please try again.");
        return null;
      }
    },
    [entries, persist]
  );

  const removeEntry = useCallback(
    async (id: string): Promise<boolean> => {
      const target = entries.find((e) => e.id === id);
      const next = entries.filter((e) => e.id !== id);
      const ok = await persist(next);
      if (!ok) return false;
      setEntries(next);
      if (target) await safeDeleteFile(target.imageUri);
      return true;
    },
    [entries, persist]
  );

  const value = useMemo<EntryContextValue>(
    () => ({
      entries,
      isHydrating,
      addEntry,
      removeEntry,
      reload,
    }),
    [entries, isHydrating, addEntry, removeEntry, reload]
  );

  return <EntryContext.Provider value={value}>{children}</EntryContext.Provider>;
}

