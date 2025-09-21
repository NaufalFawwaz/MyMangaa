export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mt-8 mb-6 px-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="cursor-pointer px-3 py-2 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:bg-[var(--bg-card)] hover:shadow-sm active:scale-95 min-w-[60px] sm:min-w-[80px]"
      >
        <span className="hidden sm:inline">Prev</span>
        <span className="sm:hidden">←</span>
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="cursor-pointer px-3 py-2 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] transition-all duration-200 hover:bg-[var(--bg-card)] hover:shadow-sm active:scale-95 min-w-[40px] sm:min-w-[50px]"
          >
            1
          </button>
          {startPage > 2 && (
            <span className="px-3 py-2 text-[var(--text-muted)] hidden sm:block">...</span>
          )}
          {startPage > 2 && (
            <span className="px-3 py-2 text-[var(--text-muted)] sm:hidden">⋯</span>
          )}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 active:scale-95 min-w-[40px] sm:min-w-[50px] ${
            page === currentPage
              ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] shadow-sm'
              : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-card)] hover:shadow-sm'
          }`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="px-3 py-2 text-[var(--text-muted)] hidden sm:block">...</span>
          )}
          {endPage < totalPages - 1 && (
            <span className="px-3 py-2 text-[var(--text-muted)] sm:hidden">⋯</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="cursor-pointer px-3 py-2 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] transition-all duration-200 hover:bg-[var(--bg-card)] hover:shadow-sm active:scale-95 min-w-[40px] sm:min-w-[50px]"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="cursor-pointer px-3 py-2 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:bg-[var(--bg-card)] hover:shadow-sm active:scale-95 min-w-[60px] sm:min-w-[80px]"
      >
        <span className="hidden sm:inline">Next</span>
        <span className="sm:hidden">→</span>
      </button>
    </div>
  );
}