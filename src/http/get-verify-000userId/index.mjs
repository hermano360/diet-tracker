import arc from "@architect/functions";
import {
  getNotificationKeys,
  getVerificationKeys,
} from "../../utils/db-keys.mjs";

export async function handler(request) {
  const client = await arc.tables();
  const DietTrackerTable = client.DietTrackerTable;

  const { pathParameters } = request;
  const { userId } = pathParameters;

  const notificationKeys = getNotificationKeys(userId);
  const userNotificationData = await DietTrackerTable.get(notificationKeys);

  console.log({ userNotificationData });

  const verificationKeys = getVerificationKeys(username);

  try {
    const record = await DietTrackerTable.get(verificationKeys);

    if (!record) {
      await DietTrackerTable.put({
        ...verificationKeys,
        username,
        status: "UNVERIFIED",
      });

      return {
        statusCode: 200,
        body: JSON.stringify({
          username,
          status: "UNVERIFIED",
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        username: record.username,
        status: record.status,
      }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error fetching data",
        error: err.message,
      }),
    };
  }
}
