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
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppRoutes } from "../app/config/routes/AppRoutes";
import Loader from "../Loader";
import { fetchAllRecipes } from "./api/receipeApi";
import useDebounce from "./hooks/useDebounce";
import CustomPagination from "./Navigation/CustomPagination";
import RecipeCard from "./RecipeCard";
import { ActionType, BaseRecipe, Recipe } from "./types";

const itemsPerPage = 9;

export default function RecipeList() {
  const [favoriteRecipes, setFavoriteRecipes] = useState<string[]>(() => {
    const saved = localStorage.getItem("favoriteRecipes");
    return saved ? JSON.parse(saved) : [];
  });

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const navigate = useNavigate();

  const {
    data: recipes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recipes"],
    queryFn: fetchAllRecipes,
  });

  if (isLoading) return <Loader />;

  if (error)
    return (
      <Typography variant="h6" align="center" color="error">
        Failed to load recipes.
      </Typography>
    );

  const handleAction = (id: string, action: ActionType) => {
    const saved = localStorage.getItem("favoriteRecipes");
    let favoriteIds: string[] = saved ? JSON.parse(saved) : [];

    if (action === ActionType.ADD && !favoriteIds.includes(id)) {
      favoriteIds.push(id);
    } else {
      favoriteIds = favoriteIds.filter((favId) => favId !== id);
    }

    localStorage.setItem("favoriteRecipes", JSON.stringify(favoriteIds));
    setFavoriteRecipes(favoriteIds);
  };

  const categories = [
    "All",
    ...new Set(recipes.map((recipe: BaseRecipe) => recipe.strCategory)),
  ];

  const filteredRecipes = recipes.filter((recipe: Recipe) => {
    const matchesSearch = recipe.strMeal
      .toLowerCase()
      .includes(debouncedSearchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || recipe.strCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRecipes = filteredRecipes.slice(startIndex, endIndex);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

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
              setCurrentPage(1);
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
