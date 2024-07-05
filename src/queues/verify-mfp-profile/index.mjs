import arc from "@architect/functions";
import { getVerificationKeys } from "../../utils/db-keys.mjs";

export async function handler(event) {
  const { Records = [] } = event;
  let client = await arc.tables();
  let DietTrackerTable = client.DietTrackerTable;

  console.log(Records);
  for (let record of Records) {
    const username = JSON.parse(record.body);

    const verificationKeys = getVerificationKeys(username);

    try {
      await DietTrackerTable.put({
        ...verificationKeys,
        username,
        status: "UNVERIFIED",
      });

      // We will be adding verification logic at a later portion

      await DietTrackerTable.put({
        ...verificationKeys,
        username,
        status: "VERIFIED",
      });

      // const response = sampleScraping();

      // const { diaryEntries, dateFetched, isPrivate } = processMacros(response);

      // if (isPrivate) {
      //   await DietTrackerTable.put({ ...verificationKeys, status: "PRIVATE" });

      //   return;
      // }

      // await saveFoodEntries(diaryEntries, userHandle, dateFetched);
    } catch (err) {
      console.log(err);
    }
  }
}
