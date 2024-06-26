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

    return {
      statusCode: 200,
      body: JSON.stringify(record),
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
