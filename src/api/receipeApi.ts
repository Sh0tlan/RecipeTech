import axios from "axios";
import { Recipe } from "../components/types";

export const fetchAllRecipes = async (): Promise<Recipe[]> => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  const allRecipes: Recipe[] = [];

  for (const letter of alphabet) {
    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
    );
    if (response.data.meals) {
      allRecipes.push(...response.data.meals);
    }
  }
  return allRecipes;
};

export const fetchRecipeById = async (id: string): Promise<Recipe> => {
  const response = await axios.get(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  return response.data.meals ? response.data.meals[0] : null;
};

export const fetchCategories = async (): Promise<string[]> => {
  const response = await axios.get(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  return response.data.categories.map(
    (category: { strCategory: string }) => category.strCategory
  );
};
