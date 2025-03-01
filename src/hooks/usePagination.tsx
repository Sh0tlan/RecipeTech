import { useState } from "react";

interface Props {
  totalItems: number;
  itemsPerPage: number;
}

const INITIAL_PAGE = 1;

export default function usePagination({ totalItems, itemsPerPage }: Props) {
  const [currentPage, setCurrentPage] = useState<number>(INITIAL_PAGE);
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
