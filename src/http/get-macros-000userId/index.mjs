import arc from "@architect/functions";
import { getMacrosKeys } from "../../utils/db-keys.mjs";

export async function handler(request) {
  const client = await arc.tables();
  const DietTrackerTable = client.DietTrackerTable;

  const { pathParameters } = request;
  const { userId } = pathParameters;

  const settingsTableKeys = getMacrosKeys(userId);

  try {
    const record = await DietTrackerTable.get(settingsTableKeys);

    if (!record) {
      return {
        statusCode: 404,
      };
    }

    const { calories, carbs, protein, fat } = record;

    return {
      statusCode: 200,
      body: JSON.stringify({
        calories,
        carbs,
        protein,
        fat,
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
