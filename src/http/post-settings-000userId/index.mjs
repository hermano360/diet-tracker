import arc from "@architect/functions";
import { getSettingsKeys } from "../../utils/dynamodb.mjs";

export async function handler(request, context) {
  let client = await arc.tables();
  let DietTrackerTable = client.DietTrackerTable;

  const { pathParameters } = request;
  const { userId } = pathParameters;

  try {
    const body = JSON.parse(request.body);

    const {
      weight,
      gender,
      strategy,
      lastMealTime,
      calories,
      carbs,
      protein,
      fat,
      myFitnessPal,
      myFitnessPalVerified,
    } = body;

    const settingsTableKeys = getSettingsKeys(userId);

    await DietTrackerTable.put({
      ...settingsTableKeys,
      weight,
      gender,
      strategy,
      lastMealTime,
      calories,
      carbs,
      protein,
      fat,
      myFitnessPal,
      myFitnessPalVerified,
      userId,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Record added" }),
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
