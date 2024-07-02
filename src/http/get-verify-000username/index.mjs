import arc from "@architect/functions";
import { getMFPVerificationKeys } from "../../utils/dynamodb.mjs";

export async function handler(request) {
  let client = await arc.tables();
  let DietTrackerTable = client.DietTrackerTable;

  const { pathParameters } = request;
  const { username } = pathParameters;

  const verificationKeys = getMFPVerificationKeys(username);

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
        body: {
          username,
          status: "UNVERIFIED",
        },
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
