import arc from "@architect/functions";
import {
  batchSave,
  getNotificationKeys,
  getSettingsKeys,
} from "../../utils/dynamodb.mjs";
import { sampleScraping, processMacros } from "../../utils/scraping.mjs";
import {
  compareMacros,
  generateSavedFoodEntries,
  processDiaryEntries,
} from "../../utils/dietary.mjs";

export async function handler(event, rest) {
  let client = await arc.tables();
  let DietTrackerTable = client.DietTrackerTable;

  const { Records = [] } = event;

  for (let { body = {} } of Records) {
    const userId = JSON.parse(body);

    const notificationKeys = getNotificationKeys(userId);
    const settingsKeys = getSettingsKeys(userId);

    const settingsData = await DietTrackerTable.get(settingsKeys);

    if (!settingsData) {
      return;
    }

    const {
      calories,
      carbs,
      protein,
      fat,
      myFitnessPal,
      myFitnessPalVerified,
    } = settingsData;

    if (!myFitnessPal || !myFitnessPalVerified) {
      return;
    }
    const response = sampleScraping();

    const { diaryEntries, dateFetched } = processMacros(response);

    const entriesToSave = generateSavedFoodEntries(
      diaryEntries,
      userId,
      dateFetched
    );

    await batchSave(entriesToSave);

    const currentResults = processDiaryEntries(diaryEntries);

    const comparison = compareMacros(currentResults, {
      calories,
      carbs,
      protein,
      fat,
    });

    const notificationData = await DietTrackerTable.get(notificationKeys);

    if (notificationData.phone && notificationData.allowText) {
      console.log({ Texting: "Texting" });
    }

    if (notificationData.email && notificationData.allowEmail) {
      console.log("Emailing");
    }
  }

  return;
}
