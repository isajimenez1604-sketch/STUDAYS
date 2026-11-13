import {
  AndroidImportance,
  SchedulableTriggerInputTypes,
  setNotificationChannelAsync,
  setNotificationHandler,
  getPermissionsAsync,
  requestPermissionsAsync,
  scheduleNotificationAsync,
  cancelScheduledNotificationAsync,
} from "expo-notifications";
import { Platform } from "react-native";

const PLANNER_CHANNEL_ID = "planner-timer";

setNotificationHandler({
  handleNotification: async (notification) => {
    const isPlannerNotice =
      notification.request.content.data?.type === "planner-interval";
    return {
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: !isPlannerNotice,
      shouldShowList: !isPlannerNotice,
    };
  },
});

export async function requestPlannerNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "web") return false;

  if (Platform.OS === "android") {
    await setNotificationChannelAsync(PLANNER_CHANNEL_ID, {
      name: "Temporizador de estudio",
      importance: AndroidImportance.HIGH,
      sound: "default",
      vibrationPattern: [0, 250, 150, 250],
    });
  }

  const current = await getPermissionsAsync();
  if (current.granted) return true;
  const requested = await requestPermissionsAsync();
  return requested.granted;
}

export async function schedulePlannerIntervalEnd(
  title: string,
  endsAt: number
): Promise<string | null> {
  if (Platform.OS === "web") return null;
  if (endsAt <= Date.now()) return null;

  return scheduleNotificationAsync({
    content: {
      title: "Terminó el intervalo",
      body: `Ahora comienza: ${title}`,
      data: { type: "planner-interval" },
      sound: "default",
      ...(Platform.OS === "android"
        ? { channelId: PLANNER_CHANNEL_ID }
        : {}),
    },
    trigger: {
      type: SchedulableTriggerInputTypes.DATE,
      date: new Date(endsAt),
      ...(Platform.OS === "android"
        ? { channelId: PLANNER_CHANNEL_ID }
        : {}),
    },
  });
}

export async function schedulePlannerSequence(
  intervals: { title: string; duration_minutes: number }[],
  currentIndex: number,
  firstEndsAt: number
): Promise<string[]> {
  const identifiers: string[] = [];
  let boundary = firstEndsAt;

  for (let index = currentIndex + 1; index < intervals.length; index += 1) {
    const identifier = await schedulePlannerIntervalEnd(
      intervals[index].title,
      boundary
    );
    if (identifier) identifiers.push(identifier);
    boundary += intervals[index].duration_minutes * 60_000;
  }

  return identifiers;
}

export async function cancelPlannerNotifications(
  identifiers: string[]
): Promise<void> {
  await Promise.all(
    identifiers.map((identifier) =>
      cancelScheduledNotificationAsync(identifier)
    )
  );
}
