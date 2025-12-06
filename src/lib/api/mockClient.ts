// Mock API client for development when backend is not available
import { authStore } from '../stores/authStore';
import type { User } from '../stores/authStore';

const MOCK_DELAY = 500; // Simulate network delay

function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

class MockApiClient {
	// Mock users storage (in real app, this would be on the backend)
	private mockUsers: Array<{ email: string; password: string; name: string; id: number }> = [];

	async signup(data: { name: string; email: string; password: string }) {
		await delay(MOCK_DELAY);
		
		// Check if user already exists
		if (this.mockUsers.find((u) => u.email === data.email)) {
			throw {
				response: {
					status: 422,
					data: { message: 'Email already registered' }
				}
			};
		}

		const user: User = {
			id: Date.now(),
			name: data.name,
			email: data.email,
			plan_type: 'FREE'
		};

		this.mockUsers.push({
			email: data.email,
			password: data.password, // In real app, this would be hashed
			name: data.name,
			id: user.id
		});

		const token = `mock_token_${Date.now()}`;
		return { user, token };
	}

	async login(data: { email: string; password: string }) {
		await delay(MOCK_DELAY);

		const user = this.mockUsers.find(
			(u) => u.email === data.email && u.password === data.password
		);

		if (!user) {
			throw {
				response: {
					status: 401,
					data: { message: 'Invalid email or password' }
				}
			};
		}

		const userData: User = {
			id: user.id,
			name: user.name,
			email: user.email,
			plan_type: 'FREE'
		};

		const token = `mock_token_${Date.now()}`;
		return { user: userData, token };
	}

	async logout() {
		await delay(MOCK_DELAY);
		return { success: true };
	}

	async getMe() {
		await delay(MOCK_DELAY);
		let user: User | null = null;
		const unsubscribe = authStore.subscribe((state) => {
			user = state.user;
		});
		unsubscribe();
		return { user };
	}

	async ocr(file: File) {
		await delay(1000); // Simulate OCR processing
		return {
			text: 'This is mock OCR text extracted from your image. In production, this would be the actual extracted text from the OCR service.',
			confidence: 0.95,
			job_id: `mock_job_${Date.now()}`
		};
	}

	async createCheckout(planType: 'PRO_MONTHLY' | 'PRO_YEARLY') {
		await delay(MOCK_DELAY);
		return {
			checkout_url: '/pricing?mock=true',
			message: 'Mock mode: Checkout would redirect to Stripe in production'
		};
	}

	async getSubscriptionStatus() {
		await delay(MOCK_DELAY);
		return { status: 'active', plan_type: 'FREE' };
	}

	async createApiKey(label?: string) {
		await delay(MOCK_DELAY);
		return {
			key: `mock_api_key_${Date.now()}_${Math.random().toString(36).substring(7)}`,
			id: Date.now()
		};
	}

	async getApiKeys() {
		await delay(MOCK_DELAY);
		return { data: [] };
	}

	async deleteApiKey(id: number) {
		await delay(MOCK_DELAY);
		return { success: true };
	}

	async getDashboardOverview() {
		await delay(MOCK_DELAY);
		return {
			uploads_this_month: 2,
			remaining_uploads: 3,
			monthly_limit: 5,
			average_confidence: 0.92,
			last_upload_at: new Date().toISOString()
		};
	}

	async getDashboardHistory(page: number = 1, perPage: number = 10) {
		await delay(MOCK_DELAY);
		return {
			data: [
				{
					id: 1,
					created_at: new Date().toISOString(),
					text_preview: 'This is mock OCR text...',
					confidence_score: 0.95
				}
			]
		};
	}

	async getDashboardChart() {
		await delay(MOCK_DELAY);
		return { data: [] };
	}
}

export const mockApiClient = new MockApiClient();

