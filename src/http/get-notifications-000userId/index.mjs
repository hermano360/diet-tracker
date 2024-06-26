import arc from "@architect/functions";
import { getNotificationKeys } from "../../utils/dynamodb.js";

export async function handler(request, context) {
  let client = await arc.tables();
  let DietTrackerTable = client.DietTrackerTable;

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

    const { myFitnessPal, myFitnessPalVerified, phone, allowText, allowEmail } =
      record;

    return {
      statusCode: 200,
      body: JSON.stringify({
        myFitnessPal,
        myFitnessPalVerified,
        phone,
        allowText,
        allowEmail,
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
