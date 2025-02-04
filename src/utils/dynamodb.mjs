import arc from "@architect/functions";

export const getNotificationKeys = (userId) => ({
  PK: `notifications`,
  SK: `notifications#userId#${userId}`,
});

export const getSettingsKeys = (userId) => ({
  PK: `settings`,
  SK: `settings#userId#${userId}`,
});

export const getUsersKeys = (userId) => ({
  PK: `users`,
  SK: `userId#${userId}`,
});
export const getVerificationKeys = (userId) => ({
  PK: `verifyMFP`,
  SK: `verified#${userId}`,
});

export const getFoodKeys = () => ({
  PK: `foods`,
});

const separateByBatches = (entries = []) => {
  const lists = [[]];

  entries.forEach((entry) => {
    if (
      lists[lists.length - 1].length > 0 &&
      lists[lists.length - 1].length >= 25
    ) {
      lists.push([]);
    }

    lists[lists.length - 1].push(entry);
  });

  return lists;
};

export const batchSave = async (entries = []) => {
  let client = await arc.tables();
  let DietTrackerTable = client.DietTrackerTable;

  for (let entry of entries) {
    await DietTrackerTable.put(entry);
  }
};
