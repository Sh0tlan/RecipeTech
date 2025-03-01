import { useState } from "react";

interface Props {
  totalItems: number;
  itemsPerPage: number;
}

export default function usePagination({ totalItems, itemsPerPage }: Props) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    handlePageChange,
  };
}
