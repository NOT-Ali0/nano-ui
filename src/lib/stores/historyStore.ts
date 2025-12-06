import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export interface OcrHistoryItem {
	id: string;
	created_at: string;
	text: string;
	file_name?: string;
	file_type?: string;
	confidence_score?: number;
}

const initialState: OcrHistoryItem[] = [];

function createHistoryStore() {
	const { subscribe, set, update }: Writable<OcrHistoryItem[]> = writable(initialState);

	return {
		subscribe,
		add: (item: Omit<OcrHistoryItem, 'id' | 'created_at'>) => {
			const newItem: OcrHistoryItem = {
				...item,
				id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
				created_at: new Date().toISOString()
			};
			update((items) => [newItem, ...items]);
			return newItem;
		},
		remove: (id: string) => {
			update((items) => items.filter((item) => item.id !== id));
		},
		update: (id: string, updates: Partial<OcrHistoryItem>) => {
			update((items) =>
				items.map((item) => (item.id === id ? { ...item, ...updates } : item))
			);
		},
		clear: () => {
			set([]);
		},
		init: () => {
			if (typeof window === 'undefined') return;
			const stored = localStorage.getItem('ocr_history');
			if (stored) {
				try {
					const items = JSON.parse(stored);
					set(items);
				} catch (e) {
					console.error('Failed to load history:', e);
				}
			}
		}
	};
}

export const historyStore = createHistoryStore();

// Auto-save to localStorage
if (typeof window !== 'undefined') {
	historyStore.subscribe((items) => {
		localStorage.setItem('ocr_history', JSON.stringify(items));
	});
}

