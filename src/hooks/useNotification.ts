import Constants from "expo-constants";
import { Alert, Platform } from "react-native";

export async function scheduleEntrySavedNotification(message: string): Promise<void> {
  // Expo Go (Android) removed notifications support; importing expo-notifications can crash.
  // In Expo Go we fall back to an in-app confirmation.
  const isExpoGo = Constants.appOwnership === "expo";
  if (isExpoGo) {
    Alert.alert("Saved", message);
    return;
  }

  try {
    const Notifications = await import("expo-notifications");

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("entries", {
        name: "Travel entries",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Travel Diary",
        body: message,
      },
      trigger: null,
    });
  } catch {
    // Best-effort: don't block saving if notifications fail.
  }
}

