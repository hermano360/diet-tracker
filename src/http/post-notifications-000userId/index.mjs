import arc from "@architect/functions";
import { getNotificationKeys } from "../../utils/db-keys.mjs";

export async function handler(request) {
  let client = await arc.tables();
  let DietTrackerTable = client.DietTrackerTable;

  const { pathParameters } = request;
  const { userId } = pathParameters;

  try {
    const body = JSON.parse(request.body);

    const { myFitnessPal, allowNotifications, alertTime } = body;

    const notificationTableKeys = getNotificationKeys(userId);

    await DietTrackerTable.put({
      ...notificationTableKeys,
      myFitnessPal,
      allowNotifications,
      alertTime,
      userId,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Notifications were created for userId ${userId}`,
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
