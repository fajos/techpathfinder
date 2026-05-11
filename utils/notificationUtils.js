import * as Notifications from "expo-notifications";

// Configure how notifications appear
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const scheduleReminderNotification = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      await Notifications.requestPermissionsAsync();
    }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🚀 Ready to level up your tech career?",
      body: "Come back and explore new career paths and roadmaps!",
    },
    trigger: {
      seconds: 60 * 60 * 24,
    },
  });
};