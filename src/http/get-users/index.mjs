import arc from "@architect/functions";

// learn more about HTTP functions here: https://arc.codes/http
export async function handler(req) {
  let client = await arc.tables();
  let DietTrackerTable = client.DietTrackerTable;

  const { Items = [] } = await DietTrackerTable.query({
    KeyConditionExpression: "PK = :pkVal AND SK > :startText",
    ExpressionAttributeValues: {
      ":pkVal": "users",
      ":startText": "userId#",
    },
    ProjectionExpression: "userId",
    ReturnConsumedCapacity: "TOTAL",
  });

  return {
    statusCode: 200,
    body: JSON.stringify(Items),
  };
}
