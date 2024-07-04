import arc from "@architect/functions";
import { getUsersKeys } from "../../utils/db-keys.mjs";

export async function handler(request) {
  const client = await arc.tables();
  const DietTrackerTable = client.DietTrackerTable;

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
