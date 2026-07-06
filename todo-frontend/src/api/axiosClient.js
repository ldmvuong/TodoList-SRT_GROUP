import axios from 'axios'

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
})

apiClient.interceptors.response.use(
	(response) => {
		const payload = response.data

		if (
			payload &&
			typeof payload === 'object' &&
			'success' in payload &&
			'data' in payload
		) {
			if (payload.success) {
				return payload.data
			}

			const error = new Error(payload.message || 'Request failed')
			error.response = payload
			error.code = payload.code
			error.status = payload.status
			error.errors = payload.errors
			error.path = payload.path
			error.timestamp = payload.timestamp
			throw error
		}

		return payload
	},
	(error) => {
		const apiError = error?.response?.data

		if (apiError && typeof apiError === 'object' && 'success' in apiError) {
			const normalizedError = new Error(apiError.message || error.message)
			normalizedError.response = apiError
			normalizedError.code = apiError.code
			normalizedError.status = apiError.status
			normalizedError.errors = apiError.errors
			normalizedError.path = apiError.path
			normalizedError.timestamp = apiError.timestamp
			return Promise.reject(normalizedError)
		}

		return Promise.reject(error)
	},
)

export default apiClient
