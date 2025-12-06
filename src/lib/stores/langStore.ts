import { writable, derived, get } from 'svelte/store';
import type { Readable } from 'svelte/store';

export type Language = 'en' | 'ar';

const STORAGE_KEY = 'nano_language';

// Create the language store
function createLangStore() {
	const { subscribe, set, update } = writable<Language>('en');

	function updateDOM(lang: Language) {
		if (typeof window !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, lang);
			// Update document direction
			document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
			document.documentElement.lang = lang;
			// Add/remove RTL class
			if (lang === 'ar') {
				document.documentElement.classList.add('rtl');
			} else {
				document.documentElement.classList.remove('rtl');
			}
		}
	}

	return {
		subscribe,
		set: (lang: Language) => {
			updateDOM(lang);
			set(lang);
		},
		toggleLanguage: () => {
			const current = get({ subscribe });
			const newLang: Language = current === 'en' ? 'ar' : 'en';
			updateDOM(newLang);
			set(newLang);
		},
		init: () => {
			// Initialize direction on mount
			if (typeof window !== 'undefined') {
				const stored = localStorage.getItem(STORAGE_KEY);
				const lang: Language = (stored === 'en' || stored === 'ar') ? stored : 'en';
				set(lang);
				updateDOM(lang);
			}
		}
	};
}

export const langStore = createLangStore();

// Derived store for current language (reactive)
export const currentLanguage: Readable<Language> = derived(langStore, ($lang) => $lang);

// Helper to get current language synchronously
export function getCurrentLanguage(): Language {
	return get(langStore);
}
