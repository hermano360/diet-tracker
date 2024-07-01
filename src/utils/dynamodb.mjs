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
  let awsClient = client._client;

  const batchSet = separateByBatches(entries).map((batchMiniSet = []) => {
    return batchMiniSet.map((entry) => ({
      PutRequest: {
        Item: entry,
      },
    }));
  });

  for (let batch of batchSet) {
    await awsClient.BatchWriteItem({
      RequestItems: {
        ["DietTrackerTable"]: batch,
      },
    });
  }
};
