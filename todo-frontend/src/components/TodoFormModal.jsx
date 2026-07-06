import { useState } from 'react'
import { extractErrorMessage } from '../utils/todoHelpers'

const initialErrorState = {
  title: '',
  description: '',
  status: '',
  general: '',
}

function TodoFormModal({ open, mode, initialValues, submitting, onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    status: initialValues?.status || 'PENDING',
  })
  const [errors, setErrors] = useState(initialErrorState)

  if (!open) {
    return null
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    setErrors((current) => ({
      ...current,
      [name]: '',
      general: '',
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = {}

    if (!form.title.trim()) {
      nextErrors.title = 'Vui lòng nhập tên công việc.'
    } else if (form.title.trim().length > 100) {
      nextErrors.title = 'Tên công việc không vượt quá 100 ký tự.'
    }

    if (form.description.trim().length > 500) {
      nextErrors.description = 'Mô tả không vượt quá 500 ký tự.'
    }

    if (mode === 'edit' && !form.status) {
      nextErrors.status = 'Vui lòng chọn trạng thái.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors((current) => ({
        ...current,
        ...nextErrors,
      }))
      return
    }

    try {
      await onSubmit({
        title: form.title,
        description: form.description,
        status: form.status,
      })
    } catch (error) {
      const responseErrors = error?.response?.errors
      const serverErrors = {
        title: '',
        description: '',
        status: '',
        general: extractErrorMessage(error),
      }

      if (responseErrors && typeof responseErrors === 'object') {
        Object.entries(responseErrors).forEach(([field, message]) => {
          if (field in serverErrors) {
            serverErrors[field] = Array.isArray(message) ? message.join(' · ') : message
          }
        })
      }

      setErrors((current) => ({
        ...current,
        ...serverErrors,
      }))
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="todo-form-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <span className="dialog-label">{mode === 'edit' ? 'Chỉnh sửa' : 'Công việc mới'}</span>
            <h2 id="todo-form-title">
              {mode === 'edit' ? 'Cập nhật công việc' : 'Tạo công việc'}
            </h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Đóng hộp thoại">
            ×
          </button>
        </div>

        {errors.general ? <div className="inline-error">{errors.general}</div> : null}

        <form className="todo-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Tiêu đề *</span>
            <input
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Ví dụ: Hoàn thành báo cáo tuần"
              maxLength={100}
            />
            <small>{errors.title || `${form.title.length}/100 ký tự`}</small>
          </label>

          <label className="field field-textarea">
            <span>Mô tả</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Thêm thông tin chi tiết, deadline hoặc checklist"
              maxLength={500}
              rows={5}
            />
            <small>{errors.description || `${form.description.length}/500 ký tự`}</small>
          </label>

          {mode === 'edit' ? (
            <label className="field">
              <span>Trạng thái</span>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="PENDING">Chưa hoàn thành</option>
                <option value="COMPLETED">Hoàn thành</option>
              </select>
              <small>{errors.status || 'Chọn trạng thái hiện tại của công việc.'}</small>
            </label>
          ) : null}

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose} disabled={submitting}>
              Hủy
            </button>
            <button type="submit" className="primary-button" disabled={submitting}>
              {submitting ? 'Đang lưu...' : mode === 'edit' ? 'Cập nhật' : 'Tạo công việc'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TodoFormModal