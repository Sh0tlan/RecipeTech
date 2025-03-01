import { useQuery } from "@tanstack/react-query";
import {
  fetchAllRecipes,
  fetchCategories,
  fetchRecipeById,
} from "../api/receipeApi";

export const useRecipes = () => {
  return useQuery({
    queryKey: ["recipes"],
    queryFn: fetchAllRecipes,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
};

export const useFavoriteRecipes = (favoriteIds: string[]) => {
  return useQuery({
    queryKey: ["favoriteRecipes", favoriteIds],
    queryFn: async () => {
      const recipes = await Promise.all(
        favoriteIds.map((id) => fetchRecipeById(id))
      );
      return recipes;
    },
    enabled: favoriteIds.length > 0,
  });
};
