import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export interface User {
	id: number;
	name: string;
	email: string;
	plan_type: 'FREE' | 'PRO_MONTHLY' | 'PRO_YEARLY';
	created_at?: string;
	isSubscribed?: boolean;
	plan?: string;
}

interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	isMockMode: boolean;
}

const initialState: AuthState = {
	user: null,
	token: null,
	isAuthenticated: false,
	isMockMode: false
};

function createAuthStore() {
	const { subscribe, set, update }: Writable<AuthState> = writable(initialState);

	return {
		subscribe,
		login: (user: User, token: string, isMockMode: boolean = false) => {
			if (typeof window !== 'undefined') {
				localStorage.setItem('auth_token', token);
				localStorage.setItem('user', JSON.stringify(user));
				localStorage.setItem('isMockMode', String(isMockMode));
			}
			set({
				user,
				token,
				isAuthenticated: true,
				isMockMode
			});
		},
		logout: () => {
			if (typeof window !== 'undefined') {
				localStorage.removeItem('auth_token');
				localStorage.removeItem('user');
				localStorage.removeItem('isMockMode');
			}
			set(initialState);
		},
		init: () => {
			if (typeof window === 'undefined') return;
			const token = localStorage.getItem('auth_token');
			const userStr = localStorage.getItem('user');
			const isMockMode = localStorage.getItem('isMockMode') === 'true';
			if (token && userStr) {
				try {
					const user = JSON.parse(userStr);
					set({
						user,
						token,
						isAuthenticated: true,
						isMockMode
					});
				} catch (e) {
					// Invalid stored data
					localStorage.removeItem('auth_token');
					localStorage.removeItem('user');
					localStorage.removeItem('isMockMode');
				}
			}
		},
		updateUser: (user: Partial<User>) => {
			update((state) => {
				if (state.user) {
					const updatedUser = { ...state.user, ...user };
					if (typeof window !== 'undefined') {
						localStorage.setItem('user', JSON.stringify(updatedUser));
					}
					return {
						...state,
						user: updatedUser
					};
				}
				return state;
			});
		},
		subscribeToPlan: (planName: string, isAnnual: boolean = false) => {
			update((state) => {
				if (state.user) {
					let planType: 'FREE' | 'PRO_MONTHLY' | 'PRO_YEARLY' = state.user.plan_type;
					if (planName === 'Pro') {
						planType = isAnnual ? 'PRO_YEARLY' : 'PRO_MONTHLY';
					} else if (planName === 'Premium') {
						planType = isAnnual ? 'PRO_YEARLY' : 'PRO_MONTHLY';
					}

					const updatedUser = {
						...state.user,
						isSubscribed: true,
						plan: planName,
						plan_type: planType
					};
					if (typeof window !== 'undefined') {
						localStorage.setItem('user', JSON.stringify(updatedUser));
					}
					
					return {
						...state,
						user: updatedUser
					};
				}
				return state;
			});
		}
	};
}

export const authStore = createAuthStore();

