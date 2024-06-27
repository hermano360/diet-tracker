import {
  fetchScraping,
  sampleScraping,
  processMacros,
} from "../../utils/scraping.mjs";

// learn more about queue functions here: https://arc.codes/queues

export async function handler(event) {
  const { Records = [] } = event;

  for (let { body = {} } of Records) {
    const {
      userId,
      phone,
      email,
      myFitnessPal,
      myFitnessPalVerified,
      allowText,
      allowEmail,
    } = JSON.parse(body);

    if (!myFitnessPalVerified || !myFitnessPal) {
      return;
    }
    try {
      // const response = await fetchScraping(myFitnessPal);

      const response = sampleScraping();

      const result = processMacros(response);

      /**
   {
  diaryEntries: [
    {
      food: 'Eggs, 8 large',
      foodName: 'Eggs',
      servingsCount: 8,
      servingsLabel: 'large',
      calories: 572,
      carbsPercentage: 3,
      fatPercentage: 63,
      proteinPercentage: 34
    },
    {
      food: 'Tostadas - Tostadas, 3 tostadas',
      foodName: 'Tostadas - Tostadas',
      servingsCount: 3,
      servingsLabel: 'tostadas',
      calories: 190,
      carbsPercentage: 62,
      fatPercentage: 14,
      proteinPercentage: 24
    },
    {
      food: 'Quest Bar(3/21/2022) - Quest Bar Cookie Dough (Net Carbs), 1 bar (60g)',
      foodName: 'Quest Bar(3/21/2022) - Quest Bar Cookie Dough (Net Carbs)',
      servingsCount: 1,
      servingsLabel: 'bar (60g)',
      calories: 190,
      carbsPercentage: 35,
      fatPercentage: 30,
      proteinPercentage: 35
    },
    {
      food: 'Modelo Especial - Modelo Especial, 36 fl oz',
      foodName: 'Modelo Especial - Modelo Especial',
      servingsCount: 36,
      servingsLabel: 'fl oz',
      calories: 429,
      carbsPercentage: 93,
      fatPercentage: 0,
      proteinPercentage: 7
    },
    {
      food: "Meyer's - Kuipers 6 Pack Muffins, 1 muffin",
      foodName: "Meyer's - Kuipers 6 Pack Muffins",
      servingsCount: 1,
      servingsLabel: 'muffin',
      calories: 30,
      carbsPercentage: 61,
      fatPercentage: 27,
      proteinPercentage: 12
    },
    {
      food: 'Pepsi - Cola, 4 Pack, 24 fl oz',
      foodName: 'Pepsi - Cola, 4 Pack',
      servingsCount: 24,
      servingsLabel: 'fl oz',
      calories: 300,
      carbsPercentage: 100,
      fatPercentage: 0,
      proteinPercentage: 0
    },
    {
      food: 'Instant oats, cooked, 4 cup, cooked',
      foodName: 'Instant oats, cooked',
      servingsCount: 4,
      servingsLabel: 'cup, cooked',
      calories: 653,
      carbsPercentage: 68,
      fatPercentage: 18,
      proteinPercentage: 14
    },
    {
      food: 'Valentina - Toast, Multigrain, 4 Pack, 4 pieces',
      foodName: 'Valentina - Toast, Multigrain, 4 Pack',
      servingsCount: 4,
      servingsLabel: 'pieces',
      calories: 170,
      carbsPercentage: 64,
      fatPercentage: 21,
      proteinPercentage: 15
    },
    {
      food: 'Valentina - Toast, Multigrain, 4 Pack, 4 pieces',
      foodName: 'Valentina - Toast, Multigrain, 4 Pack',
      servingsCount: 4,
      servingsLabel: 'pieces',
      calories: 170,
      carbsPercentage: 64,
      fatPercentage: 21,
      proteinPercentage: 15
    },
    {
      food: 'Instant oats, cooked, 4 cup, cooked',
      foodName: 'Instant oats, cooked',
      servingsCount: 4,
      servingsLabel: 'cup, cooked',
      calories: 653,
      carbsPercentage: 68,
      fatPercentage: 18,
      proteinPercentage: 14
    },
    {
      food: 'Salmon, 11 ounce',
      foodName: 'Salmon',
      servingsCount: 11,
      servingsLabel: 'ounce',
      calories: 275,
      carbsPercentage: 8,
      fatPercentage: 9,
      proteinPercentage: 83
    },
    {
      food: 'Fruit - Mango Whole, 1 whole',
      foodName: 'Fruit - Mango Whole',
      servingsCount: 1,
      servingsLabel: 'whole',
      calories: 107,
      carbsPercentage: 97,
      fatPercentage: 0,
      proteinPercentage: 3
    },
    {
      food: 'Bolay - Pesto Noodles, 1 serving',
      foodName: 'Bolay - Pesto Noodles',
      servingsCount: 1,
      servingsLabel: 'serving',
      calories: 166,
      carbsPercentage: 67,
      fatPercentage: 26,
      proteinPercentage: 7
    },
    {
      food: 'Veg-zucchini Noodles - Zucchini Noodles, 2 cup',
      foodName: 'Veg-zucchini Noodles - Zucchini Noodles',
      servingsCount: 2,
      servingsLabel: 'cup',
      calories: 40,
      carbsPercentage: 95,
      fatPercentage: 1,
      proteinPercentage: 4
    },
    {
      food: 'quinoa &amp; black beans - Quinoa &amp; Black Beans, 2 cup',
      foodName: 'quinoa &amp; black beans - Quinoa &amp; Black Beans',
      servingsCount: 2,
      servingsLabel: 'cup',
      calories: 408,
      carbsPercentage: 71,
      fatPercentage: 10,
      proteinPercentage: 19
    }
  ],
  goals: { calorieGoal: 2320, carbsGoal: 203, fatGoal: 77, proteinGoal: 203 }
       */
    } catch (err) {
      console.error(err);
    }
  }

  return;
}
