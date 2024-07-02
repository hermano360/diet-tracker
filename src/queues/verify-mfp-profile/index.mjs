import { generateSavedFoodEntries } from "../../utils/dietary.mjs";
import { getMFPVerificationKeys } from "../../utils/dynamodb.mjs";
import { processMacros } from "../../utils/scraping.mjs";

// learn more about queue functions here: https://arc.codes/queues
export async function handler(event) {
  const { Records = [] } = event;

  for (let { body = {} } of Records) {
    const userHandle = JSON.parse(body);

    const verificationKeys = getMFPVerificationKeys(userHandle);

    try {
      await DietTrackerTable.put({ ...verificationKeys, status: "UNVERIFIED" });

      const response = sampleScraping();

      const { diaryEntries, dateFetched, isPrivate } = processMacros(response);

      if (isPrivate) {
        await DietTrackerTable.put({ ...verificationKeys, status: "PRIVATE" });

        return;
      }

      await saveFoodEntries(diaryEntries, userHandle, dateFetched);
    } catch (err) {
      console.log(err);
    }
  }
}
