import arc from "@architect/functions";
import { getFoodKeys } from "../../utils/dynamodb.mjs";

export async function handler(request, context) {
  let client = await arc.tables();
  let DietTrackerTable = client.DietTrackerTable;

  const { pathParameters } = request;
  const { username } = pathParameters;

  const foodKeys = getFoodKeys(username);

  const dateNow = new Date().toISOString().split("T")[0];

  try {
    const { Items = [] } = await DietTrackerTable.query({
      KeyConditionExpression: "PK = :pkVal AND SK <= :startText",
      ExpressionAttributeValues: {
        ":pkVal": foodKeys.PK,
        ":startText": `result#${username}#${dateNow}`,
      },
      ReturnConsumedCapacity: "TOTAL",
      ScanIndexForward: false,

      Limit: 5,
    });

    console.log({ Items });

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
