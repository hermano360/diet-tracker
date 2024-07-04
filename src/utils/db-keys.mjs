export const getUsersKeys = (userId) => ({
  PK: `users`,
  SK: `userId#${userId}`,
});

export const getSettingsKeys = (userId) => ({
  PK: `settings`,
  SK: `settings#userId#${userId}`,
});
