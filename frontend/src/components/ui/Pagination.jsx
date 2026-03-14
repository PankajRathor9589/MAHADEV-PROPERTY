const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.pages <= 1) {
    return null;
  }

  const pages = Array.from({ length: pagination.pages }, (_, index) => index + 1).slice(
    Math.max(0, pagination.page - 3),
    Math.min(pagination.pages, pagination.page + 2)
  );

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(pagination.page - 1)}
        disabled={pagination.page === 1}
        className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={page === pagination.page ? "btn-primary" : "btn-secondary"}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(pagination.page + 1)}
        disabled={pagination.page === pagination.pages}
        className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
