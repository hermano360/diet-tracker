import arc from "@architect/functions";

import { getResultsKeys } from "../../utils/db-keys.mjs";

export async function handler(request, context) {
  let client = await arc.tables();
  let DietTrackerTable = client.DietTrackerTable;

  const { pathParameters } = request;
  const { userId, date } = pathParameters;

  const resultsKeys = getResultsKeys(userId, date);

  try {
    const { date, calories, fat, carbs, protein } = await DietTrackerTable.get(
      resultsKeys
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ date, calories, fat, carbs, protein }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error fetching user results data",
        error: err.message,
      }),
    };
  }
}
