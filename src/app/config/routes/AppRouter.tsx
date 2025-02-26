import { Route, Routes } from "react-router-dom";
import FavouritesRecipePage from "../../../pages/FavoriteRecipesPage";
import RecipeDetailPage from "../../../pages/RecipeDetailPage";
import RecipePage from "../../../pages/RecipePage";
import { AppRoutes } from "./AppRoutes";

export default function AppRouter() {
  return (
    <Routes>
      <Route path={AppRoutes.home} element={<RecipePage />} />
      <Route path={AppRoutes.recipe} element={<RecipeDetailPage />} />
      <Route path={AppRoutes.favourites} element={<FavouritesRecipePage />} />

      {/* Not Found Page */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}
