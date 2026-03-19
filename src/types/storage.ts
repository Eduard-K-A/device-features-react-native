export const STORAGE_KEYS = {
  theme: "travelDiary.theme",
  entries: "travelDiary.entries",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

