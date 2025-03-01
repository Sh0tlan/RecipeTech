import { Box, Typography } from "@mui/material";

interface Props {
  message: string;
}

export const ErrorHandler = ({ message }: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h6" color="error" align="center">
        {message}
      </Typography>
    </Box>
  );
};
