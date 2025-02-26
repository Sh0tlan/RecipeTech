import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { ActionType } from "./types";

interface RecipeCardProps {
  image: string;
  title: string;
  category: string;
  origin: string;
  onAction?: (action: ActionType) => void;
  actionType?: ActionType;
}

export default function RecipeCard({
  image,
  title,
  category,
  origin,
  onAction,
  actionType,
}: RecipeCardProps) {
  const buttonText =
    actionType === "add" ? "Add to Favorites" : "Remove from Favorites";

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (onAction && actionType) {
      onAction(actionType);
    }
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={image}
        alt={title}
        sx={{ objectFit: "cover" }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Category:</strong> {category}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Origin:</strong> {origin}
        </Typography>
        {onAction && actionType && (
          <Button onClick={handleButtonClick} sx={{ mt: 2 }}>
            {buttonText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
