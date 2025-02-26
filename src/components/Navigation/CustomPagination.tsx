import { Box, Pagination, PaginationItem } from "@mui/material";

interface Props {
  totalPages: number;
  currentPage: number;
  handlePageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

export default function CustomPagination({
  totalPages,
  currentPage,
  handlePageChange,
}: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 4,
        position: "relative",
        width: "100%",
        mx: "auto",
      }}
    >
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        variant="outlined"
        shape="rounded"
        color="primary"
        size="large"
        siblingCount={totalPages > 10 ? 2 : 1}
        renderItem={(item) => {
          if (item.type === "previous") {
            return (
              <PaginationItem
                {...item}
                sx={{
                  top: 0,
                  position: "absolute !important",
                  color: "#1976d2",
                  left: 0,
                  border: "1px solid #1976d2",
                }}
              />
            );
          }
          if (item.type === "next") {
            return (
              <PaginationItem
                {...item}
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  color: "#1976d2",
                  border: "1px solid #1976d2",
                }}
              />
            );
          }
          return <PaginationItem {...item} />;
        }}
      />
    </Box>
  );
}
