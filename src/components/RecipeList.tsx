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
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AppRoutes } from "../app/config/routes/AppRoutes";
import { filterRecipes } from "../helpers/filterRecipes";
import { useCategories, useRecipes } from "../hooks/recipesQueries";
import useDebounce from "../hooks/useDebounce";
import useLocalStorage from "../hooks/useLocalStorage";
import usePagination from "../hooks/usePagination";
import { ErrorHandler } from "./ErrorHandler/ErrorHandler";
import Loader from "./Loader/Loader";
import CustomPagination from "./Navigation/CustomPagination";
import RecipeCard from "./RecipeCard";
import { ActionType, Recipe } from "./types";

const itemsPerPage = 9;

export default function RecipeList() {
  const [favoriteRecipes, setFavoriteRecipes] = useLocalStorage<string[]>(
    "favoriteRecipes",
    []
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || "All"
  );
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(searchParams.get("page") || "1", 10)
  );

  const debouncedSearchTerm = useDebounce(searchTerm);

  const {
    data: recipes = [],
    isLoading: recipesLoading,
    error: recipesError,
  } = useRecipes();

  const {
    data: categoriesData = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const filteredRecipes = filterRecipes(
    recipes,
    debouncedSearchTerm,
    selectedCategory
  );

  const {
    totalPages,
    startIndex,
    endIndex,
    handlePageChange,
    resetPagination,
  } = usePagination({
    totalItems: filteredRecipes.length,
    itemsPerPage: itemsPerPage,
    currentPage,
    setCurrentPage,
  });

  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    if (searchTerm) newSearchParams.set("search", searchTerm);
    if (selectedCategory !== "All")
      newSearchParams.set("category", selectedCategory);
    if (currentPage !== 1) newSearchParams.set("page", currentPage.toString());
    setSearchParams(newSearchParams, { replace: true });
  }, [searchTerm, selectedCategory, currentPage, setSearchParams]);

  if (recipesLoading || categoriesLoading) return <Loader />;
  if (recipesError) return <ErrorHandler message="Failed to load recipes." />;
  if (categoriesError)
    return <ErrorHandler message="Failed to load categories." />;

  const handleAction = (id: string, action: ActionType) => {
    let newFavoriteIds = [...favoriteRecipes];
    if (action === ActionType.ADD && !newFavoriteIds.includes(id)) {
      newFavoriteIds.push(id);
    } else {
      newFavoriteIds = newFavoriteIds.filter((favId) => favId !== id);
    }
    setFavoriteRecipes(newFavoriteIds);
  };

  const categories = ["All", ...categoriesData];
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
              resetPagination();
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
                  favoriteRecipes?.includes(recipe.idMeal)
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
