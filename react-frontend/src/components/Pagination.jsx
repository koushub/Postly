import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="join flex justify-center mt-10">
      <button 
        className="join-item btn" 
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft size={20} />
      </button>

      {[...Array(totalPages)].map((_, index) => {
         if (
           index === 0 || 
           index === totalPages - 1 || 
           (index >= currentPage - 1 && index <= currentPage + 1)
         ) {
           return (
             <button
               key={index}
               className={`join-item btn ${currentPage === index ? 'btn-active btn-primary' : ''}`}
               onClick={() => onPageChange(index)}
             >
               {index + 1}
             </button>
           );
         } else if (
           index === currentPage - 2 || 
           index === currentPage + 2
         ) {
            return <button key={index} className="join-item btn btn-disabled">...</button>;
         }
         return null;
      })}

      <button 
        className="join-item btn" 
        disabled={currentPage === totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;