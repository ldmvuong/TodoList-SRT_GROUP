import { buildPageButtons } from '../utils/todoHelpers'

function Pagination({ meta, onPageChange }) {
  const pages = buildPageButtons(meta.page, meta.pages)

  if (meta.pages <= 1) {
    return null
  }

  return (
    <nav className="pagination" aria-label="Phân trang công việc">
      <button
        type="button"
        className="secondary-button"
        onClick={() => onPageChange(Math.max(0, meta.page - 1))}
        disabled={meta.page <= 0}
      >
        Trang trước
      </button>

      <div className="pagination-pages">
        {pages.map((page, index) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="pagination-ellipsis">
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              className={page === meta.page ? 'page-button is-active' : 'page-button'}
              onClick={() => onPageChange(page)}
            >
              {page + 1}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        className="secondary-button"
        onClick={() => onPageChange(Math.min(meta.pages - 1, meta.page + 1))}
        disabled={meta.page >= meta.pages - 1}
      >
        Trang sau
      </button>
    </nav>
  )
}

export default Pagination