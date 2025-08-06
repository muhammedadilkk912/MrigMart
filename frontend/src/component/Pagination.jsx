import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import PropTypes from 'prop-types';

const Pagination = ({ currentPage, totalPage, onPageChange }) => {
     console.log("totalPages",totalPage)
     console.log("page=",currentPage)
  if (totalPage <= 1) return null;
 

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage, endPage;

    if (totalPage <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPage;
    } else {
      const half = Math.floor(maxVisiblePages / 2);
      if (currentPage <= half + 1) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPage - half) {
        startPage = totalPage - maxVisiblePages + 1;
        endPage = totalPage;
      } else {
        startPage = currentPage - half;
        endPage = currentPage + half;
      }
    }

    // Always show first page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className={`px-3 py-1 ${currentPage === 1 ? 'font-bold text-blue-600' : 'text-gray-600'}`}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="left-ellipsis" className="px-1">...</span>);
      }
    }

    // Visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 ${currentPage === i ? 'font-bold text-blue-600' : 'text-gray-600'}`}
        >
          {i}
        </button>
      );
    }

    // Always show last page if needed
    if (endPage < totalPage) {
      if (endPage < totalPage - 1) {
        pages.push(<span key="right-ellipsis" className="px-1">...</span>);
      }
      pages.push(
        <button
          key={totalPage}
          onClick={() => onPageChange(totalPage)}
          className={`px-3 py-1 ${currentPage === totalPage ? 'font-bold text-blue-600' : 'text-gray-600'}`}
        >
          {totalPage}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-1 my-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 text-gray-600 flex items-center disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <FiChevronLeft className="mr-1" /> Back
      </button>
      
      {renderPageNumbers()}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPage}
        className="px-3 py-1 text-gray-600 flex items-center disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Next <FiChevronRight className="ml-1" />
      </button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;