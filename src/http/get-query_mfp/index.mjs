import arc from "@architect/functions";

let client = await arc.tables();
let queue = await arc.queues;

let DietTrackerTable = client.DietTrackerTable;

export async function handler(request, context) {
  try {
    const { Items = [] } = await DietTrackerTable.query({
      KeyConditionExpression: "PK = :pkVal AND SK > :startText",
      ExpressionAttributeValues: {
        ":pkVal": "notifications",
        ":startText": "notifications#userId#",
      },
      ProjectionExpression:
        "userId,phone,email,myFitnessPal,myFitnessPalVerified,allowText,allowEmail",
      ReturnConsumedCapacity: "TOTAL",
    });

    for (let user of Items) {
      await queue.publish({
        name: "QueryFitnessStats",
        payload: user,
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify(Items),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error uploading data",
        error: err.message,
      }),
    };
  }
}
