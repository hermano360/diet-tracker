export const getUsersKeys = (userId) => ({
  PK: `users`,
  SK: `userId#${userId}`,
});
