import arc from "@architect/functions";
import { getSettingsKeys } from "../../utils/db-keys.mjs";

export async function handler(request) {
  let client = await arc.tables();
  let DietTrackerTable = client.DietTrackerTable;

  const { pathParameters } = request;
  const { userId } = pathParameters;

  try {
    const body = JSON.parse(request.body);

    const { weight, gender, strategy, calories, carbs, protein, fat } = body;

    const settingsTableKeys = getSettingsKeys(userId);

    await DietTrackerTable.put({
      ...settingsTableKeys,
      weight,
      gender,
      strategy,
      calories,
      carbs,
      protein,
      fat,
      userId,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Settings created for userId ${userId}`,
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
