import {
  Box,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { fetchRecipeById } from "../components/api/receipeApi";

import { getAllIngredients } from "../components/helpers/getAllIngredients";
import RecipeCard from "../components/RecipeCard";
import { ActionType, BaseRecipe, Recipe } from "../components/types";
import Loader from "../Loader";

export default function FavoriteRecipesPage() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("favoriteRecipes");
    setFavoriteIds(saved ? JSON.parse(saved) : []);
  }, []);

  const { data: favoriteRecipes = [], isLoading } = useQuery({
    queryKey: ["favoriteRecipes", favoriteIds],
    queryFn: async () => {
      const recipes = await Promise.all(
        favoriteIds.map((id) => fetchRecipeById(id))
      );
      return recipes;
    },
    enabled: favoriteIds.length > 0,
  });

  const handleAction = (id: string, action: ActionType) => {
    if (action === ActionType.REMOVE) {
      const updatedFavorites = favoriteIds.filter((favId) => favId !== id);
      setFavoriteIds(updatedFavorites);
      localStorage.setItem("favoriteRecipes", JSON.stringify(updatedFavorites));
    }
  };

  const ingredients = getAllIngredients(favoriteRecipes);

  if (isLoading) return <Loader />;

  if (favoriteIds.length === 0)
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h6" align="center">
          You don't have any saved recipes yet.
        </Typography>
      </Container>
    );

  return (
    <Container maxWidth="lg" sx={{ py: 4, minHeight: "100vh" }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Favorite recipes
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {favoriteRecipes.map((recipe: BaseRecipe) => (
          <Grid item xs={12} sm={6} md={4} key={recipe.idMeal}>
            <RecipeCard
              image={recipe.strMealThumb}
              title={recipe.strMeal}
              category={recipe.strCategory}
              origin={recipe.strArea}
              onAction={(action) => handleAction(recipe.idMeal, action)}
              actionType={ActionType.REMOVE}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Total Ingredients List
        </Typography>
        <List>
          {ingredients.map(([ingredient, measure], index) => (
            <ListItem key={index}>
              <ListItemText primary={`${ingredient}: ${measure}`} />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box>
        <Typography variant="h5" gutterBottom>
          Cooking Instructions
        </Typography>

        {favoriteRecipes.map((recipe: Recipe) => (
          <Box key={recipe.idMeal} sx={{ mb: 3 }}>
            <Typography variant="h6">{recipe.strMeal}</Typography>
            <Typography variant="body1">{recipe.strInstructions}</Typography>
          </Box>
        ))}
      </Box>
    </Container>
  );
}
