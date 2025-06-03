import * as Notifications from 'expo-notifications';

/**
 * Request notification permissions if not already granted.
 */
export const requestPermissionsAsync = async () => {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.status !== 'granted') {
    await Notifications.requestPermissionsAsync();
  }
};

/**
 * Schedule a local reminder notification.
 * @param {string} body - Notification body text
 * @param {Date|number|object} trigger - Trigger date or rule
 * @param {object} [data] - Additional data
 * @returns {Promise<string>} identifier of scheduled notification
 */
export const scheduleReminder = async (body, trigger, data = {}) => {
  await requestPermissionsAsync();
  return await Notifications.scheduleNotificationAsync({
    content: { title: 'Innerpal', body, data },
    trigger,
  });
};

/**
 * Cancel a scheduled reminder.
 * @param {string} identifier - Notification identifier
 */
export const cancelReminder = async (identifier) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  } catch (err) {
    console.error('Cancel reminder error:', err);
  }
};
