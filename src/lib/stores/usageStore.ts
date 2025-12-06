import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export interface UsageState {
	uploads_this_month: number;
	remaining_uploads: number | typeof Infinity;
	monthly_limit: number | typeof Infinity;
	average_confidence: number | null;
	last_upload_at: string | null;
}

const initialState: UsageState = {
	uploads_this_month: 0,
	remaining_uploads: 0,
	monthly_limit: 5,
	average_confidence: null,
	last_upload_at: null
};

function createUsageStore() {
	const { subscribe, set, update }: Writable<UsageState> = writable(initialState);

	return {
		subscribe,
		setUsage: (usage: UsageState) => {
			set(usage);
		},
		setUnlimited: () => {
			update((state) => ({
				...state,
				remaining_uploads: Infinity,
				monthly_limit: Infinity
			}));
		},
		incrementUsage: () => {
			update((state) => {
				// Don't decrement if unlimited
				if (state.remaining_uploads === Infinity) {
					return {
						...state,
						uploads_this_month: state.uploads_this_month + 1
					};
				}
				return {
					...state,
					uploads_this_month: state.uploads_this_month + 1,
					remaining_uploads: Math.max(0, state.remaining_uploads - 1)
				};
			});
		},
		reset: () => {
			set(initialState);
		}
	};
}

export const usageStore = createUsageStore();

