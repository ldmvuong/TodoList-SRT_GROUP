function TodoFilters({
  filters,
  onKeywordChange,
  onStatusChange,
  onSortByChange,
  onSortDirectionChange,
  onPageSizeChange,
  onReset,
}) {
  return (
    <section className="filters-card">
      <div className="filters-grid">
        <label className="field">
          <span>Tìm kiếm</span>
          <input
            type="search"
            value={filters.keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            placeholder="Nhập tiêu đề hoặc mô tả..."
          />
        </label>

        <label className="field">
          <span>Trạng thái</span>
          <select value={filters.status} onChange={(event) => onStatusChange(event.target.value)}>
            <option value="">Tất cả</option>
            <option value="PENDING">Chưa hoàn thành</option>
            <option value="COMPLETED">Hoàn thành</option>
          </select>
        </label>

        <label className="field">
          <span>Sắp xếp theo</span>
          <select value={filters.sortBy} onChange={(event) => onSortByChange(event.target.value)}>
            <option value="createdAt">Ngày tạo</option>
            <option value="updatedAt">Ngày cập nhật</option>
            <option value="title">Tiêu đề</option>
            <option value="status">Trạng thái</option>
          </select>
        </label>

        <label className="field">
          <span>Thứ tự</span>
          <select
            value={filters.sortDirection}
            onChange={(event) => onSortDirectionChange(event.target.value)}
          >
            <option value="DESC">Giảm dần</option>
            <option value="ASC">Tăng dần</option>
          </select>
        </label>

        <label className="field">
          <span>Số dòng / trang</span>
          <select value={filters.pageSize} onChange={(event) => onPageSizeChange(event.target.value)}>
            <option value="5">5</option>
            <option value="8">8</option>
            <option value="10">10</option>
            <option value="12">12</option>
            <option value="20">20</option>
          </select>
        </label>

        <div className="filters-actions">
          <button type="button" className="secondary-button" onClick={onReset}>
            Đặt lại bộ lọc
          </button>
        </div>
      </div>
    </section>
  )
}

export default TodoFilters