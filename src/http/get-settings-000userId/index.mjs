import arc from "@architect/functions";
import { getSettingsKeys } from "../../utils/db-keys.mjs";

export async function handler(request) {
  const client = await arc.tables();
  const DietTrackerTable = client.DietTrackerTable;

  const { pathParameters } = request;
  const { userId } = pathParameters;

  const settingsTableKeys = getSettingsKeys(userId);

  try {
    const record = await DietTrackerTable.get(settingsTableKeys);

    if (!record) {
      return {
        statusCode: 404,
      };
    }

    const { weight, gender, strategy } = record;

    return {
      statusCode: 200,
      body: JSON.stringify({
        weight,
        gender,
        strategy,
        userId: record.userId,
      }),
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
