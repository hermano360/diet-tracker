const {
  generateSavedFoodEntries,
  separateByBatches,
} = require("./dietary-utils.js");

const sampleDietaryEntries = [
  {
    food: "Eggs, 8 large",
    foodName: "Eggs",
    servingsCount: 8,
    servingsLabel: "large",
    calories: 572,
    carbsPercentage: 3,
    fatPercentage: 63,
    proteinPercentage: 34,
  },
  {
    food: "Tostadas - Tostadas, 3 tostadas",
    foodName: "Tostadas - Tostadas",
    servingsCount: 3,
    servingsLabel: "tostadas",
    calories: 190,
    carbsPercentage: 62,
    fatPercentage: 14,
    proteinPercentage: 24,
  },
  {
    food: "Quest Bar(3/21/2022) - Quest Bar Cookie Dough (Net Carbs), 1 bar (60g)",
    foodName: "Quest Bar(3/21/2022) - Quest Bar Cookie Dough (Net Carbs)",
    servingsCount: 1,
    servingsLabel: "bar (60g)",
    calories: 190,
    carbsPercentage: 35,
    fatPercentage: 30,
    proteinPercentage: 35,
  },
  {
    food: "Eggs, 10 large",
    foodName: "Eggs",
    servingsCount: 10,
    servingsLabel: "large",
    calories: 715,
    carbsPercentage: 3,
    fatPercentage: 63,
    proteinPercentage: 34,
  },
];
const userId = "user123";
const todaysDate = "2024-07-01";

describe("generateSavedFoodEntries", () => {
  it("works", () => {
    const results = generateSavedFoodEntries(
      sampleDietaryEntries,
      userId,
      todaysDate
    );

    const expected = [
      {
        PK: "foods",
        SK: "food#user123#2024-07-01#Eggs, large",
        userId: "user123",
        dateCreated: "2024-07-01",
        food: "Eggs, 18 large",
        foodName: "Eggs",
        servingsCount: 18,
        servingsLabel: "large",
        calories: 1287,
        carbsPercentage: 3,
        fatPercentage: 63,
        proteinPercentage: 34,
      },
      {
        PK: "foods",
        SK: "food#user123#2024-07-01#Tostadas - Tostadas, tostadas",
        userId: "user123",
        dateCreated: "2024-07-01",
        food: "Tostadas - Tostadas, 3 tostadas",
        foodName: "Tostadas - Tostadas",
        servingsCount: 3,
        servingsLabel: "tostadas",
        calories: 190,
        carbsPercentage: 62,
        fatPercentage: 14,
        proteinPercentage: 24,
      },
      {
        PK: "foods",
        SK: "food#user123#2024-07-01#Quest Bar(3/21/2022) - Quest Bar Cookie Dough (Net Carbs), bar (60g)",
        userId: "user123",
        dateCreated: "2024-07-01",
        food: "Quest Bar(3/21/2022) - Quest Bar Cookie Dough (Net Carbs), 1 bar (60g)",
        foodName: "Quest Bar(3/21/2022) - Quest Bar Cookie Dough (Net Carbs)",
        servingsCount: 1,
        servingsLabel: "bar (60g)",
        calories: 190,
        carbsPercentage: 35,
        fatPercentage: 30,
        proteinPercentage: 35,
      },
    ];
    expect(results).toEqual(expected);
  });
});

describe("separateByBatches", () => {
  it("works", () => {
    const entries = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28, 29, 30,
    ];

    const result = separateByBatches(entries);
    expect(result).toEqual([
      [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25,
      ],
      [26, 27, 28, 29, 30],
    ]);
  });
});
