import { Recipe } from "../types";

export const getAllIngredients = (
  favoriteRecipes: Recipe[]
): [string, string][] => {
  const ingredientsList: [string, string][] = [];

  favoriteRecipes.forEach((recipe: Recipe) => {
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}` as keyof Recipe];
      const measure = recipe[`strMeasure${i}` as keyof Recipe];

      if (ingredient?.trim() && measure?.trim()) {
        ingredientsList.push([ingredient, measure]);
      }
    }
  });

  return ingredientsList;
};
