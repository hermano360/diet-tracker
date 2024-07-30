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
import {
  getMacrosKeys,
  getResultsKeys,
  getVerificationKeys,
} from "../../utils/db-keys.mjs";

export async function handler(event, rest) {
  let client = await arc.tables();
  let DietTrackerTable = client.DietTrackerTable;

  const { Records = [] } = event;

  for (let { body = {} } of Records) {
    const userId = JSON.parse(body);

    const notificationKeys = getNotificationKeys(userId);
    const settingsKeys = getSettingsKeys(userId);
    const macrosKeys = getMacrosKeys(userId);
    const settingsData = await DietTrackerTable.get(settingsKeys);
    const notificationData = await DietTrackerTable.get(notificationKeys);
    const macrosData = await DietTrackerTable.get(macrosKeys);

    if (!settingsData || !notificationData) {
      return;
    }

    const { myFitnessPal, usernameStatus } = notificationData;

    if (!myFitnessPal) {
      return;
    }

    const isMyFitnessPalVerified = usernameStatus === "VERIFIED";

    if (!isMyFitnessPalVerified) {
      console.log("My fitness pal has not been verified");
      return;
    }

    try {
      // const response = await sampleScraping(myFitnessPal);
      const response = sampleScraping();

      const { diaryEntries, dateFetched } = processMacros(response);

      const entriesToSave = generateSavedFoodEntries(
        diaryEntries,
        userId,
        dateFetched
      );

      await batchSave(entriesToSave);

      const currentResults = processDiaryEntries(diaryEntries);

      const resultsKeys = getResultsKeys(userId, dateFetched);

      try {
        await DietTrackerTable.put({
          ...resultsKeys,
          ...currentResults,
          date: dateFetched,
        });
      } catch (err) {
        console.log(err);
      }

      // could be necessary to make a better decision. may just go into a separate function for clarity
      // const comparison = compareMacros(currentResults, {
      //   calories,
      //   carbs,
      //   protein,
      //   fat,
      // });

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
