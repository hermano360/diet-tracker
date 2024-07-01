import arc from "@architect/functions";

let client = await arc.tables();
let queue = await arc.queues;

let DietTrackerTable = client.DietTrackerTable;

export async function handler(req) {
  const userRecords = await DietTrackerTable.query({
    KeyConditionExpression: "PK = :pkVal AND SK > :startText",
    ExpressionAttributeValues: {
      ":pkVal": "users",
      ":startText": "userId#",
    },
    ProjectionExpression: "userId",
    ReturnConsumedCapacity: "TOTAL",
  });

  const users = userRecords.Items || [];

  console.log(process.env);

  for (let { userId } of users) {
    await queue.publish({
      name: "query-user-data",
      payload: userId,
    });
  }

  return {
    statusCode: 200,
    body: JSON.stringify(users),
  };
}
