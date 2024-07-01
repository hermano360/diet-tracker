import arc from "@architect/functions";
import { getUsersKeys } from "../../utils/dynamodb.mjs";
import { v4 as uuid } from "uuid";

export async function handler(request, context) {
  let client = await arc.tables();
  let DietTrackerTable = client.DietTrackerTable;

  const { pathParameters } = request;
  const { userId } = pathParameters;

  const userTableKeys = getUsersKeys(userId);

  await DietTrackerTable.put({
    ...userTableKeys,
    userId,
  });

  return {
    statusCode: 200,
    body: `User ${userId} has been created`,
  };
}
