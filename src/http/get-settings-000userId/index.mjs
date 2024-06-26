import arc from "@architect/functions";

export async function handler(request, context) {
  let client = await arc.tables();
  let DietTrackerTable = client.DietTrackerTable;

  const { pathParameters } = request;
  const { userId } = pathParameters;

  try {
    const record = await DietTrackerTable.get({
      PK: `settings`,
      SK: `settings#userId#${userId}`,
    });

    if (!record) {
      return {
        statusCode: 404,
      };
    }

    const {
      weight,
      gender,
      strategy,
      lastMealTime,
      calories,
      carbs,
      protein,
      fat,
    } = record;

    return {
      statusCode: 200,
      body: JSON.stringify({
        weight,
        gender,
        strategy,
        lastMealTime,
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
