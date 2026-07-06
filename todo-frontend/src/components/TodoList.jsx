function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-${status.toLowerCase()}`}>
      {status === 'COMPLETED' ? 'Hoàn thành' : 'Chưa hoàn thành'}
    </span>
  )
}

function TodoList({ todos, loading, onEdit, onDelete, onToggle, actionTodoId }) {
  if (loading) {
    return (
      <div className="todo-grid">
        {Array.from({ length: 4 }).map((_, index) => (
          <article key={index} className="todo-card todo-card-skeleton">
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line short" />
          </article>
        ))}
      </div>
    )
  }

  if (!todos.length) {
    return (
      <div className="empty-state">
        <div className="empty-state-visual">✓</div>
        <h3>Chưa có công việc nào trên trang này.</h3>
        <p>Hãy tạo công việc mới hoặc thay đổi bộ lọc để xem dữ liệu phù hợp hơn.</p>
      </div>
    )
  }

  return (
    <div className="todo-grid">
      {todos.map((todo) => (
        <article key={todo.id} className="todo-card">
          <div className="todo-card-top">
            <StatusBadge status={todo.status} />
            <button
              type="button"
              className={`toggle-button ${todo.status === 'COMPLETED' ? 'is-completed' : ''}`}
              onClick={() => onToggle(todo)}
              disabled={actionTodoId === todo.id}
            >
              {actionTodoId === todo.id
                ? 'Đang xử lý...'
                : todo.status === 'COMPLETED'
                  ? 'Đánh dấu chưa hoàn thành'
                  : 'Đánh dấu hoàn thành'}
            </button>
          </div>

          <div className="todo-card-body">
            <h3>{todo.title}</h3>
            <p>{todo.description || 'Không có mô tả.'}</p>
          </div>

          <div className="todo-card-actions">
            <button type="button" className="secondary-button" onClick={() => onEdit(todo)}>
              Chỉnh sửa
            </button>
            <button type="button" className="danger-button" onClick={() => onDelete(todo)}>
              Xóa
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}

export default TodoList