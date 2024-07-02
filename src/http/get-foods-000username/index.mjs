import arc from "@architect/functions";
import { getFoodKeys } from "../../utils/dynamodb.mjs";

export async function handler(request, context) {
  let client = await arc.tables();
  let DietTrackerTable = client.DietTrackerTable;

  const { pathParameters } = request;
  const { userId } = pathParameters;

  const foodKeys = getFoodKeys(userId);

  const dateNow = new Date().toISOString().split("T")[0];
  try {
    const { Items = [] } = await DietTrackerTable.query({
      KeyConditionExpression: "PK = :pkVal AND SK <= :startText",
      ExpressionAttributeValues: {
        ":pkVal": foodKeys.PK,
        ":startText": `result#${userId}#${dateNow}`,
      },
      ReturnConsumedCapacity: "TOTAL",
      Limit: 1,
    });

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
