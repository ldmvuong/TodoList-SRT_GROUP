import apiClient from '../api/axiosClient'

const basePath = '/api/v1/todos'

export function getTodos(params = {}) {
  return apiClient.get(basePath, { params })
}

export function createTodo(payload) {
  return apiClient.post(basePath, payload)
}

export function updateTodo(id, payload) {
  return apiClient.put(`${basePath}/${id}`, payload)
}

export function deleteTodo(id) {
  return apiClient.delete(`${basePath}/${id}`)
}

export function toggleTodoStatus(id) {
  return apiClient.patch(`${basePath}/${id}/status`)
}