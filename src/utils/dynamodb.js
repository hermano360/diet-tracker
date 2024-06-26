export const getNotificationKeys = (userId) => ({
  PK: `notifications`,
  SK: `notifications#userId#${userId}`,
});

export const getSettingsKeys = (userId) => ({
  PK: `settings`,
  SK: `settings#userId#${userId}`,
});
