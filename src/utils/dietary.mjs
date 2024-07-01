const FAT_FACTOR = 9;
const CARB_FACTOR = 4;
const PROTEIN_FACTOR = 4;

export const processDiaryEntries = (diaryEntries = []) => {
  const results = diaryEntries.reduce(
    (totals, entry) => {
      return {
        calories: totals.calories + entry.calories,
        fat:
          totals.fat +
          (entry.fatPercentage * entry.calories * 0.01) / FAT_FACTOR,
        carbs:
          totals.carbs +
          (entry.carbsPercentage * entry.calories * 0.01) / CARB_FACTOR,
        protein:
          totals.protein +
          (entry.proteinPercentage * entry.calories * 0.01) / PROTEIN_FACTOR,
      };
    },
    { calories: 0, fat: 0, protein: 0, carbs: 0 }
  );

  return results;
};

export const compareMacros = (results = {}, goals = {}) => {
  return {
    calories: goals.calories - results.calories,
    carbs: goals.carbs - results.carbs,
    protein: goals.protein - results.protein,
    fat: goals.fat - results.fat,
  };
};

export const generateComparisonText = (results = {}, goals = {}) => {
  const comparison = compareMacros(results, goals);

  return `${
    comparison.calories / goals.calories > 1 / 3
      ? `You may be missing a meal. You have more than a third of your calories left.\n\n`
      : ""
  }You are currently ${Math.abs(comparison.calories)} calories ${
    comparison.calories > 0 ? "under" : "over"
  } your goal of ${
    goals.calories
  } calories.\n\nIn addition, you are currently ${Math.abs(
    comparison.protein
  )} grams of protein ${
    comparison.protein > 0 ? "under" : "over"
  } your goal of ${goals.protein} grams of protein.`;
};
