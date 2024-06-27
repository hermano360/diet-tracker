import arc from "@architect/functions";
import { getNotificationKeys } from "../../utils/dynamodb.mjs";

export async function handler(request) {
  let client = await arc.tables();
  let DietTrackerTable = client.DietTrackerTable;

  const { pathParameters } = request;
  const { userId } = pathParameters;

  try {
    const body = JSON.parse(request.body);

    const {
      myFitnessPal,
      myFitnessPalVerified,
      phone,
      allowText,
      allowEmail,
      email,
    } = body;

    const notificationTableKeys = getNotificationKeys(userId);

    await DietTrackerTable.put({
      ...notificationTableKeys,
      myFitnessPal,
      myFitnessPalVerified,
      phone,
      email,
      allowText,
      allowEmail,
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
