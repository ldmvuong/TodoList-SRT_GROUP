export function formatDateTime(value) {
  if (!value) {
    return 'N/A'
  }

  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'N/A'
  }

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function extractErrorMessage(error) {
  if (!error) {
    return 'Đã xảy ra lỗi.'
  }

  const response = error.response || error
  const serverErrors = response?.errors

  if (serverErrors && typeof serverErrors === 'object') {
    const messages = Object.values(serverErrors)
      .flat()
      .filter(Boolean)

    if (messages.length > 0) {
      return messages.join(' · ')
    }
  }

  return response?.message || error.message || 'Đã xảy ra lỗi.'
}

export function buildPageButtons(currentPage, totalPages) {
  if (!totalPages) {
    return []
  }

  const lastPage = totalPages - 1

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index)
  }

  const pages = new Set([0, lastPage, currentPage - 1, currentPage, currentPage + 1])
  const visiblePages = Array.from(pages)
    .filter((page) => page >= 0 && page <= lastPage)
    .sort((left, right) => left - right)

  const output = []

  visiblePages.forEach((page, index) => {
    output.push(page)

    const nextPage = visiblePages[index + 1]
    if (nextPage !== undefined && nextPage - page > 1) {
      output.push('ellipsis')
    }
  })

  return output
}