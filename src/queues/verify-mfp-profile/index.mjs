import arc from "@architect/functions";
import {
  getNotificationKeys,
  getVerificationKeys,
} from "../../utils/db-keys.mjs";
import { saveFoodEntries } from "../../utils/dietary.mjs";
import {
  fetchScraping,
  processMacros,
  sampleScraping,
} from "../../utils/scraping.mjs";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function handler(event) {
  const { Records = [] } = event;
  let client = await arc.tables();
  let DietTrackerTable = client.DietTrackerTable;

  for (let record of Records) {
    const { userId, myFitnessPal, allowNotifications, alertTime } = JSON.parse(
      record.body
    );

    const notificationKeys = getNotificationKeys(userId);

    try {
      await DietTrackerTable.put({
        ...notificationKeys,
        myFitnessPal,
        allowNotifications,
        alertTime,
        usernameStatus: "UNVERIFIED",
      });

      console.log(`Fetching diary for ${myFitnessPal}`);
      // const response = await fetchScraping(username);
      const response = await sampleScraping();
      await sleep(20000);

      console.log({ response });

      const { diaryEntries, dateFetched, isPrivate } = processMacros(response);

      if (isPrivate) {
        await DietTrackerTable.put({
          ...verificationKeys,
          myFitnessPal,
          allowNotifications,
          alertTime,
          status: "PRIVATE",
        });

        return;
      }

      await DietTrackerTable.put({
        ...notificationKeys,
        myFitnessPal,
        allowNotifications,
        alertTime,
        usernameStatus: "VERIFIED",
      });

      await saveFoodEntries(diaryEntries, userId, dateFetched);
    } catch (err) {
      console.log(err);
    }
  }
}
