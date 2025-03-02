interface Props {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const INITIAL_PAGE = 1;

export default function usePagination({
  totalItems,
  itemsPerPage,
  currentPage,
  setCurrentPage,
}: Props) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  const resetPagination = () => {
    setCurrentPage(INITIAL_PAGE);
  };

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    handlePageChange,
    resetPagination,
  };
}
