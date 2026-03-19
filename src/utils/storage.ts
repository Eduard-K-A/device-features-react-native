import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export async function safeGetItem(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    Alert.alert("Storage error", "Failed to read saved data. Please try again.");
    return null;
  }
}

export async function safeSetItem(key: string, value: string): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (e) {
    Alert.alert("Storage error", "Failed to save data. Please try again.");
    return false;
  }
}

export async function safeRemoveItem(key: string): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    Alert.alert("Storage error", "Failed to update saved data. Please try again.");
    return false;
  }
}

export async function safeSetJson<T>(key: string, value: T): Promise<boolean> {
  return safeSetItem(key, JSON.stringify(value));
}

export async function safeGetJson<T>(key: string): Promise<T | null> {
  const raw = await safeGetItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch (e) {
    Alert.alert("Storage error", "Saved data is corrupted. Resetting it.");
    await safeRemoveItem(key);
    return null;
  }
}

