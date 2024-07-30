export const getUsersKeys = (userId) => ({
  PK: `users`,
  SK: `userId#${userId}`,
});

export const getSettingsKeys = (userId) => ({
  PK: `settings`,
  SK: `settings#userId#${userId}`,
});
export const getMacrosKeys = (userId) => ({
  PK: `macros`,
  SK: `macros#userId#${userId}`,
});

export const getNotificationKeys = (userId) => ({
  PK: `notifications`,
  SK: `notifications#userId#${userId}`,
});

export const getVerificationKeys = (userId) => ({
  PK: `verify`,
  SK: `verified#${userId}`,
});
export const getResultsKeys = (userId, date) => ({
  PK: `results`,
  SK: `results#${userId}#${date}`,
});
