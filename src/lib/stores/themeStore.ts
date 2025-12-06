import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

type Theme = 'light' | 'dark';

function createThemeStore() {
	const { subscribe, set, update }: Writable<Theme> = writable<Theme>('light');

	return {
		subscribe,
		setTheme: (theme: Theme) => {
			set(theme);
			if (typeof window !== 'undefined') {
				localStorage.setItem('theme', theme);
				if (theme === 'dark') {
					document.documentElement.classList.add('dark');
				} else {
					document.documentElement.classList.remove('dark');
				}
			}
		},
		toggleTheme: () => {
			update((theme) => {
				const newTheme = theme === 'light' ? 'dark' : 'light';
				if (typeof window !== 'undefined') {
					localStorage.setItem('theme', newTheme);
					if (newTheme === 'dark') {
						document.documentElement.classList.add('dark');
					} else {
						document.documentElement.classList.remove('dark');
					}
				}
				return newTheme;
			});
		},
		init: () => {
			if (typeof window === 'undefined') return;
			const stored = localStorage.getItem('theme') as Theme | null;
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			const theme = stored || (prefersDark ? 'dark' : 'light');
			set(theme);
			if (theme === 'dark') {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}
	};
}

export const themeStore = createThemeStore();

