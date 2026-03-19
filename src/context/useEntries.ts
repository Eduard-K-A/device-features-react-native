import { useContext } from "react";
import { EntryContext } from "./EntryContext";

export function useEntries() {
  const ctx = useContext(EntryContext);
  if (!ctx) throw new Error("useEntries must be used within EntryProvider");
  return ctx;
}

