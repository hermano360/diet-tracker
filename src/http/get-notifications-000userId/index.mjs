import arc from "@architect/functions";
import { getNotificationKeys } from "../../utils/db-keys.mjs";

export async function handler(request) {
  const client = await arc.tables();
  const DietTrackerTable = client.DietTrackerTable;

  const { pathParameters } = request;
  const { userId } = pathParameters;

  const notificationTableKeys = getNotificationKeys(userId);

  try {
    const record = await DietTrackerTable.get(notificationTableKeys);

    if (!record) {
      return {
        statusCode: 404,
      };
    }

    const { myFitnessPal, allowNotifications, lastMealTime } = record;

    return {
      statusCode: 200,
      body: JSON.stringify({
        myFitnessPal,
        allowNotifications,
        lastMealTime,
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
