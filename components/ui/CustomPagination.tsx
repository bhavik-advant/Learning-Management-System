import { get } from 'http';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from './pagination';

const CustomPagination = ({
  showPageInfo = true,
  paginationData,
  getPreviousPage,
  getNextPage,
}: {
  paginationData: {
    currentPage: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  getPreviousPage: () => void;
  getNextPage: () => void;
  showPageInfo?: boolean;
}) => {
  const handlePagination = (ident: 'previous' | 'next') => {
    if (ident === 'previous') {
      if (paginationData.currentPage <= 1) return;
      getPreviousPage();
      return;
    }

    if (!paginationData?.hasNextPage) return;
    getNextPage();
  };
  return (
    <Pagination>
      <PaginationContent>
        {paginationData?.hasPreviousPage && (
          <PaginationItem>
            <PaginationPrevious onClick={handlePagination.bind(null, 'previous')} />
          </PaginationItem>
        )}

        {showPageInfo && (
          <PaginationItem>
            <span className="text-xs">
              Page {paginationData?.currentPage} of {paginationData?.totalPages}
            </span>
          </PaginationItem>
        )}

        {paginationData?.hasNextPage && (
          <PaginationItem>
            <PaginationNext onClick={handlePagination.bind(null, 'next')} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
