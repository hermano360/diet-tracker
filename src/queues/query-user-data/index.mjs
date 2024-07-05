import arc from "@architect/functions";
import {
  batchSave,
  getNotificationKeys,
  getSettingsKeys,
} from "../../utils/dynamodb.mjs";
import {
  sampleScraping,
  processMacros,
  // fetchScraping,
} from "../../utils/scraping.mjs";
import {
  compareMacros,
  generateSavedFoodEntries,
  processDiaryEntries,
} from "../../utils/dietary.mjs";
import { getVerificationKeys } from "../../utils/db-keys.mjs";

export async function handler(event, rest) {
  let client = await arc.tables();
  let DietTrackerTable = client.DietTrackerTable;

  const { Records = [] } = event;

  for (let { body = {} } of Records) {
    const userId = JSON.parse(body);

    const notificationKeys = getNotificationKeys(userId);
    const settingsKeys = getSettingsKeys(userId);

    const settingsData = await DietTrackerTable.get(settingsKeys);
    const notificationData = await DietTrackerTable.get(notificationKeys);

    console.log({ settingsData, notificationData });
    if (!settingsData || !notificationData) {
      return;
    }

    const { calories, carbs, protein, fat } = settingsData;

    const { myFitnessPal, allowNotifications } = notificationData;

    if (!myFitnessPal) {
      return;
    }

    const verificationKeys = getVerificationKeys(myFitnessPal);

    const verificationData = await DietTrackerTable.get(verificationKeys);

    if (!verificationData) {
      return;
    }

    const { status } = verificationData;

    const isMyFitnessPalVerified = status === "VERIFIED";

    console.log({
      isMyFitnessPalVerified,
      status,
    });

    if (!isMyFitnessPalVerified) {
      return;
    }

    console.log({
      isMyFitnessPalVerified,
      myFitnessPal,
      allowNotifications,
      calories,
      carbs,
      protein,
      fat,
    });

    try {
      console.log("Beginning fetching");
      // const response = await sampleScraping(myFitnessPal);
      const response = sampleScraping();

      const { diaryEntries, dateFetched } = processMacros(response);

      console.log({ diaryEntries, dateFetched });

      const entriesToSave = generateSavedFoodEntries(
        diaryEntries,
        userId,
        dateFetched
      );

      console.log({ entriesToSave });

      await batchSave(entriesToSave);

      const currentResults = processDiaryEntries(diaryEntries);

      const comparison = compareMacros(currentResults, {
        calories,
        carbs,
        protein,
        fat,
      });

      console.log({ comparison });

      if (notificationData.phone && notificationData.allowText) {
        console.log({ Texting: "Texting" });
      }

      if (notificationData.email && notificationData.allowEmail) {
        console.log("Emailing");
      }

      return;
    } catch (err) {
      console.log(err);
    }
  }
}
