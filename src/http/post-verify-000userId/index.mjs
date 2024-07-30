import arc from "@architect/functions";

export async function handler(request) {
  const queue = await arc.queues;
  const { pathParameters } = request;

  const { userId } = pathParameters;

  const { username } = JSON.parse(request.body);

  await queue.publish({
    name: "verify-mfp-profile",
    payload: { username, userId },
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Verification for ${username} is in progress`,
    }),
  };
}
