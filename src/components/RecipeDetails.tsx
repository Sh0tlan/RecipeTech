import {
  Box,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

import { Recipe } from "./types";
import { fetchRecipeById } from "../api/receipeApi";

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();

  const {
    data: recipe,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => fetchRecipeById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !recipe) {
    return (
      <Box maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" align="center">
          Recipe not found.
        </Typography>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Button component={Link} to="/" variant="contained" color="primary">
            Back to Recipes
          </Button>
        </Box>
      </Box>
    );
  }

  const ingredients: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}` as keyof Recipe];
    const measure = recipe[`strMeasure${i}` as keyof Recipe];

    if (ingredient?.trim() && measure?.trim()) {
      ingredients.push(`${measure} ${ingredient}`);
    }
  }

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        <Box sx={{ flex: "1 1 100px" }}>
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            style={{ width: "100%", borderRadius: "8px" }}
          />
        </Box>

        <Box sx={{ flex: "2 1 500px" }}>
          <Typography variant="h4" component="h1">
            {recipe.strMeal}
          </Typography>
          <Typography variant="h6">
            <strong>ID:</strong> {recipe.idMeal || "None"}
          </Typography>
          <Typography variant="h6">
            <strong>Category:</strong> {recipe.strCategory || "None"}
          </Typography>
          <Typography variant="h6">
            <strong>Area:</strong> {recipe.strArea || "None"}
          </Typography>
          <Typography variant="h6">
            <strong>Tags:</strong> {recipe.strTags || "None"}
          </Typography>
          <Typography variant="h6">
            <strong>Date Modified:</strong>
            {recipe.dateModified || "Not specified"}
          </Typography>
          <Typography variant="h6">
            <strong>Creative Commons Confirmed:</strong>{" "}
            {recipe.strCreativeCommonsConfirmed || "Not specified"}
          </Typography>
          <Typography variant="h6">
            <strong>Drink Alternate:</strong>{" "}
            {recipe.strDrinkAlternate || "Not specified"}
          </Typography>
          <Typography variant="h6">
            <strong>Image Source:</strong> {recipe.strImageSource || "None"}
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Typography variant="h5" gutterBottom>
            Ingredients
          </Typography>
          <List>
            {ingredients.map((item, index) => (
              <ListItem key={index}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />

          <Typography variant="h5" gutterBottom>
            Instructions
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {recipe.strInstructions}
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Typography variant="h6">
            <strong>Source:</strong>
            {recipe.strSource ? (
              <a
                href={recipe.strSource}
                target="_blank"
                rel="noopener noreferrer"
              >
                {recipe.strSource}
              </a>
            ) : (
              "Not specified"
            )}
          </Typography>
          <Typography variant="h6">
            <strong>YouTube:</strong>{" "}
            {recipe.strYoutube ? (
              <a href={recipe.strYoutube} target="_blank">
                Watch Video
              </a>
            ) : (
              "Not available"
            )}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
