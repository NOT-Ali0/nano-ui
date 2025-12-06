import { get } from 'svelte/store';
import { langStore } from '../stores/langStore';
import enTranslations from './en.json';
import arTranslations from './ar.json';

const translations = {
	en: enTranslations,
	ar: arTranslations
};

/**
 * Translation function that retrieves translated strings based on the current language
 * @param key - Translation key in dot notation (e.g., 'navbar.title' or 'auth.signIn')
 * @param params - Optional parameters to replace placeholders in the translation
 * @returns Translated string
 */
export function t(key: string, params?: Record<string, string | number>): string {
	const lang = get(langStore);
	const translationMap = translations[lang] || translations.en;
	
	// Split the key by dots to navigate the nested object
	const keys = key.split('.');
	let value: any = translationMap;
	
	for (const k of keys) {
		if (value && typeof value === 'object' && k in value) {
			value = value[k];
		} else {
			// Fallback to English if translation not found
			const enValue = translations.en;
			let enResult: any = enValue;
			for (const enKey of keys) {
				if (enResult && typeof enResult === 'object' && enKey in enResult) {
					enResult = enResult[enKey];
				} else {
					return key; // Return key if not found in English either
				}
			}
			value = enResult;
			break;
		}
	}
	
	// If value is not a string, return the key
	if (typeof value !== 'string') {
		return key;
	}
	
	// Replace placeholders with params
	if (params) {
		return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
			return params[paramKey]?.toString() || match;
		});
	}
	
	return value;
}

