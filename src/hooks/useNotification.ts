import Constants from "expo-constants";
import { Platform } from "react-native";

export async function scheduleEntrySavedNotification(message: string): Promise<void> {
  try {
    const Notifications = await import("expo-notifications");

    // Ensure we have permission to show notifications (especially important on iOS).
    const current = await Notifications.getPermissionsAsync();
    if (current.granted !== true) {
      await Notifications.requestPermissionsAsync();
    }

    // Ensure the handler shows alerts while the app is in foreground (local notifications).
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

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
    // (We keep this silent because the user requested real notifications, but some environments may still not support them.)
  }
}

