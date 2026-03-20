import { Platform } from "react-native";

let initialized = false;

export async function initializeNotifications(): Promise<void> {
  if (initialized) return;
  try {
    const Notifications = await import("expo-notifications");
    initialized = true;

    const current = await Notifications.getPermissionsAsync();
    if (current.granted !== true) {
      await Notifications.requestPermissionsAsync();
    }

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("travel-diary", {
        name: "Travel Diary",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#818cf8",
      });
    }
  } catch {
    // best effort
  }
}

export async function scheduleEntrySavedNotification(entryTitle: string): Promise<void> {
  try {
    await initializeNotifications();
    const Notifications = await import("expo-notifications");
    const safeTitle = entryTitle.trim().length > 0 ? entryTitle : "Untitled Entry";
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Travel Diary",
        body: `Successfully Added "${safeTitle}"`,
        sound: "default",
        data: { entryTitle: safeTitle },
      },
      // Some expo-notifications typings in this project don't include `android.channelId`,
      // but Android still supports selecting a channelId for local notifications.
      // We use a narrow type assertion to keep the rest strictly typed.
      android: {
        channelId: "travel-diary",
      },
      trigger: null,
    } as unknown as Parameters<typeof Notifications.scheduleNotificationAsync>[0] & {
      android?: { channelId: string };
    });
  } catch {
    // best effort
  }
}

