import { Recipe } from "../components/types";

export const filterRecipes = (
  recipes: Recipe[],
  searchTerm: string,
  selectedCategory: string
): Recipe[] => {
  const debouncedSearchTerm = searchTerm.toLowerCase();

  return recipes.filter((recipe: Recipe) => {
    const matchesSearch = recipe.strMeal
      .toLowerCase()
      .includes(debouncedSearchTerm);
    const matchesCategory =
      selectedCategory === "All" || recipe.strCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });
};
