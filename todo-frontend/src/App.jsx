import { useEffect, useState } from 'react'
import TodoFilters from './components/TodoFilters'
import TodoFormModal from './components/TodoFormModal'
import TodoList from './components/TodoList'
import Pagination from './components/Pagination'
import { useDebounce } from './hooks/useDebounce'
import {
  createTodo,
  deleteTodo,
  getTodos,
  toggleTodoStatus,
  updateTodo,
} from './services/todoService'
import { extractErrorMessage } from './utils/todoHelpers'
import './App.css'

const defaultFilters = {
  keyword: '',
  status: '',
  sortBy: 'createdAt',
  sortDirection: 'DESC',
  page: 0,
  pageSize: 8,
}

const defaultMeta = {
  page: 0,
  pageSize: 8,
  pages: 0,
  total: 0,
}

const emptyForm = {
  title: '',
  description: '',
  status: 'PENDING',
}

function App() {
  const [todos, setTodos] = useState([])
  const [meta, setMeta] = useState(defaultMeta)
  const [filters, setFilters] = useState(defaultFilters)
  const [loading, setLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [listError, setListError] = useState('')
  const [notice, setNotice] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [activeTodo, setActiveTodo] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [actionTodoId, setActionTodoId] = useState(null)
  const [deletingTodo, setDeletingTodo] = useState(null)

  const debouncedKeyword = useDebounce(filters.keyword, 350)

  useEffect(() => {
    let isActive = true

    async function loadTodos() {
      setLoading(true)
      setListError('')

      try {
        const response = await getTodos({
          keyword: debouncedKeyword.trim() || undefined,
          status: filters.status || undefined,
          page: filters.page,
          pageSize: filters.pageSize,
          sortBy: filters.sortBy,
          sortDirection: filters.sortDirection,
        })

        if (!isActive) {
          return
        }

        const nextMeta = response?.meta || defaultMeta

        if (
          nextMeta.pages > 0 &&
          filters.page >= nextMeta.pages &&
          filters.page !== 0
        ) {
          setFilters((current) => ({
            ...current,
            page: nextMeta.pages - 1,
          }))
          return
        }

        if (nextMeta.pages === 0 && filters.page !== 0) {
          setFilters((current) => ({
            ...current,
            page: 0,
          }))
          return
        }

        setTodos(response?.result || [])
        setMeta(nextMeta)
      } catch (error) {
        if (!isActive) {
          return
        }

        setTodos([])
        setMeta(defaultMeta)
        setListError(extractErrorMessage(error))
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    loadTodos()

    return () => {
      isActive = false
    }
  }, [
    debouncedKeyword,
    filters.page,
    filters.pageSize,
    filters.sortBy,
    filters.sortDirection,
    filters.status,
    refreshKey,
  ])

  useEffect(() => {
    if (!notice) {
      return undefined
    }

    const timer = window.setTimeout(() => setNotice(''), 2800)
    return () => window.clearTimeout(timer)
  }, [notice])

  const refreshTodos = () => {
    setRefreshKey((value) => value + 1)
  }

  const openCreateModal = () => {
    setModalMode('create')
    setActiveTodo(null)
    setModalOpen(true)
  }

  const openEditModal = (todo) => {
    setModalMode('edit')
    setActiveTodo(todo)
    setModalOpen(true)
  }

  const closeModal = () => {
    if (submitting) {
      return
    }

    setModalOpen(false)
    setActiveTodo(null)
  }

  const handleSubmitTodo = async (values) => {
    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
    }

    if (modalMode === 'edit') {
      payload.status = values.status
    }

    setSubmitting(true)

    try {
      if (modalMode === 'edit' && activeTodo) {
        await updateTodo(activeTodo.id, payload)
        setNotice('Đã cập nhật công việc.')
      } else {
        await createTodo(payload)
        setFilters((current) => ({
          ...current,
          page: 0,
        }))
        setNotice('Đã thêm công việc mới.')
      }

      setModalOpen(false)
      setActiveTodo(null)
      refreshTodos()
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleStatus = async (todo) => {
    setActionTodoId(todo.id)

    try {
      await toggleTodoStatus(todo.id)
      setNotice(
        todo.status === 'COMPLETED'
          ? 'Đã chuyển về chưa hoàn thành.'
          : 'Đã đánh dấu hoàn thành.',
      )
      refreshTodos()
    } catch (error) {
      setNotice(extractErrorMessage(error))
    } finally {
      setActionTodoId(null)
    }
  }

  const handleDeleteTodo = async () => {
    if (!deletingTodo) {
      return
    }

    setActionTodoId(deletingTodo.id)

    try {
      await deleteTodo(deletingTodo.id)
      setNotice('Đã xóa công việc.')
      setDeletingTodo(null)
      refreshTodos()
    } catch (error) {
      setNotice(extractErrorMessage(error))
    } finally {
      setActionTodoId(null)
    }
  }

  return (
    <main className="todo-app-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="hero-badge"># Todo List Demo</span>
          <button type="button" className="primary-button" onClick={openCreateModal}>
            + Thêm công việc
          </button>
        </div>
      </section>

      <section className="content-panel">
        <TodoFilters
          filters={filters}
          onKeywordChange={(keyword) =>
            setFilters((current) => ({
              ...current,
              keyword,
              page: 0,
            }))
          }
          onStatusChange={(status) =>
            setFilters((current) => ({
              ...current,
              status,
              page: 0,
            }))
          }
          onSortByChange={(sortBy) =>
            setFilters((current) => ({
              ...current,
              sortBy,
              page: 0,
            }))
          }
          onSortDirectionChange={(sortDirection) =>
            setFilters((current) => ({
              ...current,
              sortDirection,
              page: 0,
            }))
          }
          onPageSizeChange={(pageSize) =>
            setFilters((current) => ({
              ...current,
              pageSize: Number(pageSize),
              page: 0,
            }))
          }
          onReset={() => setFilters(defaultFilters)}
        />

        <div className="table-summary">
          <div>
            <strong>{todos.length}</strong>
            <span>công việc trên trang</span>
          </div>
          <div>
            <strong>
              {meta.pages > 0 ? `${meta.page + 1}/${meta.pages}` : '0/0'}
            </strong>
            <span>trang hiện tại</span>
          </div>
          <div>
            <strong>{meta.pageSize}</strong>
            <span>mục mỗi trang</span>
          </div>
        </div>

        {listError ? (
          <div className="banner banner-error">
            <div>
              <strong>Không tải được dữ liệu.</strong>
              <p>{listError}</p>
            </div>
            <button type="button" className="secondary-button" onClick={refreshTodos}>
              Thử lại
            </button>
          </div>
        ) : null}

        <TodoList
          todos={todos}
          loading={loading}
          onEdit={openEditModal}
          onDelete={setDeletingTodo}
          onToggle={handleToggleStatus}
          actionTodoId={actionTodoId}
        />

        <Pagination
          meta={meta}
          onPageChange={(page) =>
            setFilters((current) => ({
              ...current,
              page,
            }))
          }
        />
      </section>

      {modalOpen ? (
        <TodoFormModal
          key={`${modalMode}-${activeTodo?.id || 'new'}`}
          open={modalOpen}
          mode={modalMode}
          initialValues={activeTodo || emptyForm}
          submitting={submitting}
          onClose={closeModal}
          onSubmit={handleSubmitTodo}
        />
      ) : null}

      {deletingTodo ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setDeletingTodo(null)}>
          <div
            className="confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="dialog-label">Xóa công việc</span>
            <h2 id="delete-title">Bạn chắc chắn muốn xóa công việc này?</h2>
            <p>
              <strong>{deletingTodo.title}</strong>
              {deletingTodo.description ? ` · ${deletingTodo.description}` : ''}
            </p>
            <div className="dialog-actions">
              <button type="button" className="secondary-button" onClick={() => setDeletingTodo(null)}>
                Hủy
              </button>
              <button
                type="button"
                className="danger-button"
                onClick={handleDeleteTodo}
                disabled={actionTodoId === deletingTodo.id}
              >
                {actionTodoId === deletingTodo.id ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}

export default App
