<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { authStore, usageStore } from '$lib/stores';
	import { t } from '$lib/i18n';
	import { detectCardType, type CardInfo } from '$lib/utils/cardDetection';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	let cardNumber = $state('');
	let cardholderName = $state('');
	let expirationDate = $state('');
	let cvv = $state('');
	let loading = $state(false);
	let cardInfo = $state<CardInfo>({ type: 'unknown', name: 'Unknown Card', icon: '💳' });
	let plan = $state<string | null>(null);
	let planPrice = $state<number>(0);
	let isAnnual = $state(false);
	let authState = $state<{ isAuthenticated: boolean; user: any }>({
		isAuthenticated: false,
		user: null
	});

	// Plan configurations
	const planConfigs: Record<string, { name: string; monthly: number; annual: number }> = {
		pro: {
			name: 'Pro',
			monthly: 9.99,
			annual: 7.99
		},
		premium: {
			name: 'Premium',
			monthly: 29.99,
			annual: 24.99
		}
	};

	onMount(() => {
		// Check authentication
		authStore.subscribe((state) => {
			authState = state;
			if (!state.isAuthenticated) {
				goto('/auth');
			}
		});

		// Get plan from query params
		const planParam = $page.url.searchParams.get('plan');
		if (!planParam || !planConfigs[planParam.toLowerCase()]) {
			// Invalid or missing plan, redirect to pricing
			setTimeout(() => {
				goto('/pricing');
			}, 2000);
			return;
		}

		plan = planParam.toLowerCase();
		const config = planConfigs[plan];
		planPrice = config.monthly;

		// Check if annual is selected (from query param)
		const annualParam = $page.url.searchParams.get('annual');
		if (annualParam === 'true') {
			isAnnual = true;
			planPrice = config.annual;
		}
	});

	// Detect card type on card number change
	$effect(() => {
		if (cardNumber) {
			cardInfo = detectCardType(cardNumber);
		} else {
			cardInfo = { type: 'unknown', name: 'Unknown Card', icon: '💳' };
		}
	});

	// Format card number with spaces
	$effect(() => {
		if (cardNumber) {
			const cleaned = cardNumber.replace(/\s+/g, '').replace(/\D/g, '');
			const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
			const newValue = formatted.substring(0, 19); // Max 16 digits + 3 spaces
			if (newValue !== cardNumber) {
				cardNumber = newValue;
			}
		}
	});

	// Format expiration date (MM/YY)
	$effect(() => {
		if (expirationDate) {
			const cleaned = expirationDate.replace(/\D/g, '');
			let newValue = cleaned;
			if (cleaned.length >= 2) {
				newValue = `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
			}
			if (newValue !== expirationDate) {
				expirationDate = newValue;
			}
		}
	});

	// Format CVV (3-4 digits)
	$effect(() => {
		if (cvv) {
			const cleaned = cvv.replace(/\D/g, '').substring(0, 4);
			if (cleaned !== cvv) {
				cvv = cleaned;
			}
		}
	});

	// Validation helpers (visual feedback only - mock accepts anything)
	function isCardNumberValid(): boolean {
		const cleaned = cardNumber.replace(/\s+/g, '').replace(/\D/g, '');
		return cleaned.length >= 13 && cleaned.length <= 19;
	}

	function isExpirationValid(): boolean {
		const cleaned = expirationDate.replace(/\D/g, '');
		return cleaned.length === 4;
	}

	function isCvvValid(): boolean {
		const cleaned = cvv.replace(/\D/g, '');
		return cleaned.length >= 3 && cleaned.length <= 4;
	}

	function isFormValid(): boolean {
		return (
			isCardNumberValid() &&
			cardholderName.trim().length > 0 &&
			isExpirationValid() &&
			isCvvValid()
		);
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!isFormValid() || !plan) {
			return;
		}

		loading = true;

		// Simulate payment processing (1 second delay)
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Update auth store with subscription
		const planName = planConfigs[plan]?.name || 'Pro';
		authStore.subscribeToPlan(planName, isAnnual);

		// Remove upload limits by setting unlimited uploads
		usageStore.setUnlimited();

		// Set flag for subscription success modal
		if (typeof window !== 'undefined') {
			sessionStorage.setItem('justSubscribed', 'true');
			sessionStorage.setItem('subscribedPlan', planName);
		}

		// Redirect to upload page
		goto('/upload');
	}

	const config = $derived(plan ? planConfigs[plan] : null);
</script>

<div class="min-h-screen bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-background dark:to-background py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="text-center mb-8 animate-fade-in">
			<h1 class="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
				{t('checkout.title')}
			</h1>
			<p class="text-muted-foreground">{t('checkout.subtitle')}</p>
		</div>

		{#if !plan}
			<!-- Error State -->
			<Card class="p-8 text-center animate-fade-in">
				<div class="mb-4">
					<svg
						class="w-16 h-16 mx-auto text-destructive"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<h2 class="text-xl font-semibold mb-2">{t('checkout.invalidPlan')}</h2>
				<p class="text-muted-foreground mb-4">
					{t('checkout.invalidPlanDesc')}
				</p>
			</Card>
		{:else}
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<!-- Checkout Form -->
				<div class="lg:col-span-2">
					<Card class="p-6 sm:p-8 backdrop-blur-xl bg-white/60 dark:bg-[#393E46]/80 border-white/20 dark:border-white/10 animate-fade-in">
						<h2 class="text-xl font-semibold mb-6">{t('checkout.paymentInfo')}</h2>

						<form onsubmit={handleSubmit} class="space-y-6">
							<!-- Card Number -->
							<div>
								<label for="cardNumber" class="block text-sm font-medium mb-2 text-foreground">
									{t('checkout.cardNumber')}
								</label>
								<div class="relative">
									<Input
										id="cardNumber"
										type="text"
										placeholder="1234 5678 9012 3456"
										bind:value={cardNumber}
										maxlength={19}
										required
										class={`pr-12 ${isCardNumberValid() ? 'border-green-500 ring-green-500' : ''}`}
									/>
									<!-- Card Type Indicator -->
									<div
										class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2"
									>
										<span class="text-lg">{cardInfo.icon}</span>
										<span
											class="text-xs font-medium text-muted-foreground"
											class:text-cyan-500={cardInfo.type !== 'unknown'}
										>
											{cardInfo.name}
										</span>
									</div>
								</div>
								{#if isCardNumberValid()}
									<p class="mt-1 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
										<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clip-rule="evenodd"
											/>
										</svg>
										{t('checkout.validCardNumber')}
									</p>
								{/if}
							</div>

							<!-- Cardholder Name -->
							<div>
								<label for="cardholderName" class="block text-sm font-medium mb-2 text-foreground">
									{t('checkout.cardholderName')}
								</label>
								<Input
									id="cardholderName"
									type="text"
									placeholder="John Doe"
									bind:value={cardholderName}
									required
									class={`${cardholderName.trim().length > 0 ? 'border-green-500 ring-green-500' : ''}`}
								/>
								{#if cardholderName.trim().length > 0}
									<p class="mt-1 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
										<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clip-rule="evenodd"
											/>
										</svg>
										{t('checkout.validName')}
									</p>
								{/if}
							</div>

							<!-- Expiration and CVV Row -->
							<div class="grid grid-cols-2 gap-4">
								<!-- Expiration Date -->
								<div>
									<label
										for="expirationDate"
										class="block text-sm font-medium mb-2 text-foreground"
									>
										{t('checkout.expirationDate')}
									</label>
									<Input
										id="expirationDate"
										type="text"
										placeholder="MM/YY"
										bind:value={expirationDate}
										maxlength={5}
										required
										class={`${isExpirationValid() ? 'border-green-500 ring-green-500' : ''}`}
									/>
									{#if isExpirationValid()}
										<p class="mt-1 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
											<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
												<path
													fill-rule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
													clip-rule="evenodd"
												/>
											</svg>
											{t('checkout.valid')}
										</p>
									{/if}
								</div>

								<!-- CVV -->
								<div>
									<label for="cvv" class="block text-sm font-medium mb-2 text-foreground">
										{t('checkout.cvv')}
									</label>
									<Input
										id="cvv"
										type="text"
										placeholder="123"
										bind:value={cvv}
										maxlength={4}
										required
										class={`${isCvvValid() ? 'border-green-500 ring-green-500' : ''}`}
									/>
									{#if isCvvValid()}
										<p class="mt-1 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
											<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
												<path
													fill-rule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
													clip-rule="evenodd"
												/>
											</svg>
											{t('checkout.valid')}
										</p>
									{/if}
								</div>
							</div>

							<!-- Submit Button -->
							<Button
								type="submit"
								variant="subscribe"
								class="w-full"
								disabled={!isFormValid() || loading}
							>
								{#if loading}
									<span class="flex items-center gap-2">
										<svg
											class="animate-spin h-4 w-4"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												class="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												stroke-width="4"
											></circle>
											<path
												class="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
										{t('checkout.processing')}
									</span>
								{:else}
									{t('checkout.confirmSubscription')}
								{/if}
							</Button>
						</form>
					</Card>
				</div>

				<!-- Order Summary -->
				<div class="lg:col-span-1">
					<Card class="p-6 backdrop-blur-xl bg-white/60 dark:bg-[#393E46]/80 border-white/20 dark:border-white/10 sticky top-8 animate-fade-in">
						<h2 class="text-xl font-semibold mb-6">{t('checkout.orderSummary')}</h2>

						{#if config}
							<div class="space-y-4">
								<!-- Plan Info -->
								<div class="pb-4 border-b border-border">
									<div class="flex items-center justify-between mb-2">
										<span class="font-semibold text-foreground">{config.name} {t('checkout.plan')}</span>
										<span class="text-sm text-muted-foreground">
											{isAnnual ? t('pricing.annual') : t('pricing.monthly')}
										</span>
									</div>
									<div class="flex items-baseline justify-between">
										<span class="text-3xl font-bold text-foreground">
											${planPrice.toFixed(2)}
										</span>
										<span class="text-sm text-muted-foreground">
											/{isAnnual ? t('pricing.perYear') : t('pricing.perMonth')}
										</span>
									</div>
								</div>

								<!-- Features List -->
								<div class="space-y-2">
									<p class="text-sm font-medium text-foreground mb-2">{t('checkout.includes')}</p>
									<ul class="space-y-2 text-sm text-muted-foreground">
										{#if plan === 'pro'}
											<li class="flex items-start gap-2">
												<svg
													class="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M5 13l4 4L19 7"
													/>
												</svg>
												{t('checkout.features.proUploads')}
											</li>
											<li class="flex items-start gap-2">
												<svg
													class="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M5 13l4 4L19 7"
													/>
												</svg>
												{t('checkout.features.proAccuracy')}
											</li>
											<li class="flex items-start gap-2">
												<svg
													class="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M5 13l4 4L19 7"
													/>
												</svg>
												{t('checkout.features.proApi')}
											</li>
										{:else if plan === 'premium'}
											<li class="flex items-start gap-2">
												<svg
													class="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M5 13l4 4L19 7"
													/>
												</svg>
												{t('checkout.features.premiumUploads')}
											</li>
											<li class="flex items-start gap-2">
												<svg
													class="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M5 13l4 4L19 7"
													/>
												</svg>
												{t('checkout.features.premiumOcr')}
											</li>
											<li class="flex items-start gap-2">
												<svg
													class="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M5 13l4 4L19 7"
													/>
												</svg>
												{t('checkout.features.premiumTeam')}
											</li>
											<li class="flex items-start gap-2">
												<svg
													class="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M5 13l4 4L19 7"
													/>
												</svg>
												{t('checkout.features.premiumSupport')}
											</li>
										{/if}
									</ul>
								</div>

								<!-- Total -->
								<div class="pt-4 border-t border-border">
									<div class="flex items-center justify-between">
										<span class="font-semibold text-foreground">{t('checkout.total')}</span>
										<span class="text-2xl font-bold text-foreground">
											${planPrice.toFixed(2)}
										</span>
									</div>
									<p class="text-xs text-muted-foreground mt-1">
										{isAnnual ? t('checkout.billedAnnually') : t('checkout.billedMonthly')}
									</p>
								</div>

								<!-- Security Badge -->
								<div class="pt-4 border-t border-border">
									<div class="flex items-center gap-2 text-xs text-muted-foreground">
										<svg
											class="w-4 h-4 text-green-500"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
											/>
										</svg>
										<span>{t('checkout.mockPayment')}</span>
									</div>
								</div>
							</div>
						{/if}
					</Card>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in {
		animation: fadeIn 0.6s ease-out forwards;
	}

	@media (prefers-reduced-motion: reduce) {
		.animate-fade-in {
			animation: none;
			opacity: 1;
		}
	}
</style>

