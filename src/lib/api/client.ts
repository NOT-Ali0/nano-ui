import axios, { type AxiosInstance, type AxiosError } from 'axios';
import { browser } from '$app/environment';
import { authStore } from '../stores/authStore';

// Use Laravel backend API
const API_BASE_URL = 'https://ocr-main-ddl4dg.laravel.cloud/api';

class ApiClient {
	private client: AxiosInstance;

	constructor() {
		this.client = axios.create({
			baseURL: API_BASE_URL,
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			timeout: 30000 // 30 seconds for OCR processing
		});

		// Request interceptor to add auth token
		this.client.interceptors.request.use(
			(config) => {
				if (browser) {
					const token = localStorage.getItem('auth_token');
					if (token) {
						config.headers.Authorization = `Bearer ${token}`;
					}
				}
				return config;
			},
			(error) => {
				return Promise.reject(error);
			}
		);

		// Response interceptor to handle Laravel response format and errors
		this.client.interceptors.response.use(
			(response) => {
				// Laravel returns {success, message, data, ...}
				// Extract the relevant data
				return response.data;
			},
			(error: AxiosError) => {
				if (browser) {
					console.error('API Error:', {
						message: error.message,
						status: error.response?.status,
						data: error.response?.data,
						url: error.config?.url
					});
				}
				
				// Handle 401 Unauthorized - logout and redirect
				if (error.response?.status === 401 && browser) {
					authStore.logout();
					window.location.href = '/auth';
				}

				// Transform Laravel validation errors
				const errorData = error.response?.data as any;
				if (errorData?.errors) {
					// Get first validation error message
					const firstError = Object.values(errorData.errors)[0];
					const errorMessage = Array.isArray(firstError) ? firstError[0] : 'Validation failed';
					throw new Error(errorMessage);
				}

				// Use Laravel's message if available
				if (errorData?.message) {
					throw new Error(errorData.message);
				}

				// Default error message
				throw new Error('Something went wrong. Please try again.');
			}
		);
	}

	// Auth endpoints - matching Laravel API
	async signup(data: { name: string; email: string; password: string; password_confirmation: string }) {
		try {
			const response: any = await this.client.post('/auth/register', data);
			return {
				user: response.user,
				token: response.token
			};
		} catch (error: any) {
			throw error;
		}
	}

	async login(data: { email: string; password: string }) {
		try {
			const response: any = await this.client.post('/auth/login', data);
			return {
				user: response.user,
				token: response.token
			};
		} catch (error: any) {
			throw error;
		}
	}

	async logout() {
		const response = await this.client.post('/auth/logout');
		return response;
	}

	async getMe() {
		const response: any = await this.client.get('/auth/me');
		return response.user;
	}

	async refreshToken() {
		const response: any = await this.client.post('/auth/refresh');
		return {
			token: response.token
		};
	}

	// OCR endpoints - matching Laravel API
	async ocr(file: File) {
		const formData = new FormData();
		formData.append('image', file); // Laravel expects 'image' field
		
		const response = await this.client.post('/ocr/upload', formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
		
		return {
			file_id: response.data.file_id,
			original_filename: response.data.original_filename,
			extracted_text: response.data.extracted_text,
			from_cache: response.data.from_cache,
			processed_at: response.data.processed_at,
			processing_time_ms: response.data.processing_time_ms
		};
	}

	async getOCRResult(id: number) {
		const response = await this.client.get(`/ocr/result/${id}`);
		return response.data;
	}

	async getOCRHistory(page: number = 1, limit: number = 10) {
		const response = await this.client.get('/ocr/history', {
			params: { page, per_page: limit }
		});
		return response.data; // Array of history items
	}

	// Dashboard endpoints
	async getDashboardOverview() {
		// Note: This endpoint doesn't exist in current API docs
		// Fallback to history for now
		try {
			const response = await this.client.get('/ocr/history', {
				params: { page: 1, per_page: 100 }
			});
			return {
				total_uploads: response.data?.length || 0,
				history: response.data || []
			};
		} catch (error) {
			return {
				total_uploads: 0,
				history: []
			};
		}
	}

	async getDashboardHistory(page: number = 1, perPage: number = 10) {
		return this.getOCRHistory(page, perPage);
	}
}

// Export singleton instance
export const apiClient = new ApiClient();

// Also export the class for testing
export { ApiClient };
