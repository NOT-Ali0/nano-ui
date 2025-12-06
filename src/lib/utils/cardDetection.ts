/**
 * Card type detection utility
 * Detects card type based on the first digits of the card number
 */

export type CardType = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';

export interface CardInfo {
	type: CardType;
	name: string;
	icon: string;
}

export function detectCardType(cardNumber: string): CardInfo {
	// Remove spaces and non-digits
	const cleaned = cardNumber.replace(/\s+/g, '').replace(/\D/g, '');

	if (!cleaned) {
		return {
			type: 'unknown',
			name: 'Unknown Card',
			icon: '💳'
		};
	}

	const firstDigit = cleaned[0];
	const firstTwo = cleaned.substring(0, 2);
	const firstFour = cleaned.substring(0, 4);

	// Visa: starts with 4
	if (firstDigit === '4') {
		return {
			type: 'visa',
			name: 'Visa',
			icon: '💳'
		};
	}

	// MasterCard: starts with 5
	if (firstDigit === '5') {
		return {
			type: 'mastercard',
			name: 'MasterCard',
			icon: '💳'
		};
	}

	// American Express: starts with 34 or 37
	if (firstTwo === '34' || firstTwo === '37') {
		return {
			type: 'amex',
			name: 'American Express',
			icon: '💳'
		};
	}

	// Discover: starts with 6011
	if (firstFour === '6011') {
		return {
			type: 'discover',
			name: 'Discover',
			icon: '💳'
		};
	}

	// Unknown
	return {
		type: 'unknown',
		name: 'Unknown Card',
		icon: '💳'
	};
}

