import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppRoutes } from "../app/config/routes/AppRoutes";

import { fetchAllRecipes } from "../api/receipeApi";

import { filterRecipes } from "../helpers/filterRecipes";
import useLocalStorage from "../hooks/useLocalStorage";
import usePagination from "../hooks/usePagination";
import { ErrorHandler } from "./ErrorHandler/ErrorHandler";
import Loader from "./Loader/Loader";
import CustomPagination from "./Navigation/CustomPagination";
import RecipeCard from "./RecipeCard";
import { ActionType, BaseRecipe, Recipe } from "./types";

const itemsPerPage = 9;

export default function RecipeList() {
  const [favoriteRecipes, setFavoriteRecipes] = useLocalStorage<string[]>(
    "favoriteRecipes",
    []
  );

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const {
    data: recipes = [],
    isLoading: recipesLoading,
    error: recipesError,
  } = useQuery({
    queryKey: ["recipes"],
    queryFn: fetchAllRecipes,
  });

  const filteredRecipes = filterRecipes(recipes, searchTerm, selectedCategory);

  const { currentPage, totalPages, startIndex, endIndex, handlePageChange } =
    usePagination({
      totalItems: filteredRecipes.length,
      itemsPerPage,
    });

  const navigate = useNavigate();

  if (recipesLoading) return <Loader />;

  if (recipesError) {
    return <ErrorHandler message="Failed to load recipes." />;
  }

  const handleAction = (id: string, action: ActionType) => {
    let newFavoriteIds = [...favoriteRecipes];

    if (action === ActionType.ADD && !newFavoriteIds.includes(id)) {
      newFavoriteIds.push(id);
    } else {
      newFavoriteIds = newFavoriteIds.filter((favId) => favId !== id);
    }

    setFavoriteRecipes(newFavoriteIds);
  };

  const categories = [
    "All",
    ...new Set(recipes.map((recipe: BaseRecipe) => recipe.strCategory)),
  ];

  const paginatedRecipes = filteredRecipes.slice(startIndex, endIndex);

  return (
    <Container maxWidth="lg" sx={{ py: 4, minHeight: "100vh" }}>
      <Box
        sx={{
          maxWidth: 600,
          mx: "auto",
          mb: 4,
          display: "flex",
          gap: 2,
          alignItems: "center",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search recipes..."
          label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ bgcolor: "background.paper" }}
        />
        <FormControl sx={{ width: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={(e) => {
              setSelectedCategory(e.target.value as string);
              handlePageChange(1);
            }}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={() => navigate(AppRoutes.favourites)}
        >
          Favorites
        </Button>
      </Box>

      <Grid container spacing={3}>
        {paginatedRecipes.map((recipe: Recipe) => (
          <Grid item xs={12} sm={6} md={4} key={recipe.idMeal}>
            <Link
              to={`/recipe/${recipe.idMeal}`}
              style={{ textDecoration: "none" }}
            >
              <RecipeCard
                image={recipe.strMealThumb}
                title={recipe.strMeal}
                category={recipe.strCategory}
                origin={recipe.strArea}
                onAction={(action) => handleAction(recipe.idMeal, action)}
                actionType={
                  favoriteRecipes.includes(recipe.idMeal)
                    ? ActionType.REMOVE
                    : ActionType.ADD
                }
              />
            </Link>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <CustomPagination
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />
      )}
    </Container>
  );
}
