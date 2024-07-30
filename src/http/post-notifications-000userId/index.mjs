import arc from "@architect/functions";

export async function handler(request) {
  const queue = await arc.queues;

  const { pathParameters } = request;
  const { userId } = pathParameters;

  try {
    const body = JSON.parse(request.body);

    const { myFitnessPal, allowNotifications, alertTime } = body;

    await queue.publish({
      name: "verify-mfp-profile",
      payload: { userId, myFitnessPal, allowNotifications, alertTime },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Request for profile verification was initiated for ${userId}`,
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
