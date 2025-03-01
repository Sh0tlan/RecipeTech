import { Recipe } from "../components/types";

export const getAllIngredients = (
  favoriteRecipes: Recipe[]
): [string, string][] => {
  const ingredientsMap = new Map<string, string[]>();

  favoriteRecipes.forEach((recipe) => {
    Object.keys(recipe).forEach((key) => {
      if (key.startsWith("strIngredient")) {
        const index = key.replace("strIngredient", "");
        const ingredient = recipe[key as keyof Recipe]?.trim().toLowerCase();
        const measure = recipe[`strMeasure${index}` as keyof Recipe]?.trim();

        if (ingredient && measure) {
          if (!ingredientsMap.has(ingredient)) {
            ingredientsMap.set(ingredient, []);
          }
          if (!ingredientsMap.get(ingredient)!.includes(measure)) {
            ingredientsMap.get(ingredient)!.push(measure);
          }
        }
      }
    });
  });

  return Array.from(ingredientsMap.entries()).map(([ingredient, measures]) => [
    ingredient.charAt(0).toUpperCase() + ingredient.slice(1),
    measures.join(", "),
  ]);
};
