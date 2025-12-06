<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores';
	import { apiClient } from '$lib/api';
	import { t } from '$lib/i18n';
	import ShineBorder from '$lib/components/ui/ShineBorder.svelte';
	import AnimatedLabel from './AnimatedLabel.svelte';
	import ShimmerButton from './ShimmerButton.svelte';
	import Input from '$lib/components/ui/Input.svelte';

	let isSignUp = $state(false);
	let loading = $state(false);
	let error = $state('');
	let name = $state('');
	let email = $state('');
	let password = $state('');
	let passwordConfirm = $state('');

	onMount(() => {
		// Redirect if already authenticated
		const unsubscribe = authStore.subscribe((state) => {
			if (state.isAuthenticated) {
				unsubscribe();
				goto('/upload');
			}
		});
		return unsubscribe;
	});

	async function handleSubmit() {
		loading = true;
		error = '';

		try {
			// Check for mock credentials (silent - no UI hints)
			const MOCK_EMAIL = 'mohammadnafia1@gmail.com';
			const MOCK_PASSWORD = '12345678';

			if (!isSignUp && email === MOCK_EMAIL && password === MOCK_PASSWORD) {
				// Mock login - authenticate directly without API call
				const mockUser = {
					id: 1,
					name: 'Mohammad Nafia',
					email: MOCK_EMAIL,
					plan_type: 'FREE' as const
				};
				const mockToken = `mock_token_${Date.now()}`;
				authStore.login(mockUser, mockToken, true);
				goto('/upload');
				return;
			}

			// Real API call for other credentials
			let response;
			if (isSignUp) {
				response = await apiClient.signup({ name, email, password, password_confirmation: passwordConfirm });
				// Mark that user just signed up
				if (typeof window !== 'undefined') {
					sessionStorage.setItem('justSignedUp', 'true');
				}
				authStore.login(response.user, response.token, false);
			} else {
				response = await apiClient.login({ email, password });
				authStore.login(response.user, response.token, false);
			}

			goto('/upload');
		} catch (err: any) {
			if (err.response) {
				error = err.response.data?.message || err.response.data?.error || t('auth.serverError');
			} else if (err.request) {
				error = t('auth.invalidCredentials');
			} else {
				error = err.message || t('auth.invalidCredentials');
			}
		} finally {
			loading = false;
		}
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-background dark:to-background px-4 py-12">
	<ShineBorder borderRadius="1rem" duration="3s" class="w-full max-w-md">
		<div class="p-8">
			<!-- Header -->
			<div class="text-center mb-8">
				<h1 class="text-3xl font-bold mb-2 text-foreground">
					{isSignUp ? t('auth.titleSignUp') : t('auth.title')}
				</h1>
				<p class="text-sm text-muted-foreground">
					{isSignUp ? t('auth.subtitleSignUp') : t('auth.subtitle')}
				</p>
			</div>

			<!-- Error Message -->
			{#if error}
				<div
					class="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm border border-destructive/20 animate-fade-in"
				>
					{error}
				</div>
			{/if}

			<!-- Form -->
			<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-6">
				{#if isSignUp}
					<!-- Name Field (Sign Up Only) -->
					<div>
						<AnimatedLabel text={t('auth.name')} for="name" delay={0.2} />
						<Input
							id="name"
							bind:value={name}
							required
							class="mt-2"
							placeholder="John Doe"
						/>
					</div>
				{/if}

				<!-- Email Field -->
				<div>
					<AnimatedLabel text={t('auth.email')} for="email" delay={isSignUp ? 0.4 : 0.2} />
					<Input
						id="email"
						type="email"
						bind:value={email}
						required
						class="mt-2"
						placeholder="you@example.com"
					/>
				</div>

				<!-- Password Field -->
				<div>
					<AnimatedLabel text={t('auth.password')} for="password" delay={isSignUp ? 0.6 : 0.4} />
					<Input
						id="password"
						type="password"
						bind:value={password}
						required
						class="mt-2"
						placeholder="••••••••"
					/>
				</div>

				{#if isSignUp}
					<!-- Confirm Password Field (Sign Up Only) -->
					<div>
						<AnimatedLabel text="Confirm Password" for="password-confirm" delay={0.8} />
						<Input
							id="password-confirm"
							type="password"
							bind:value={passwordConfirm}
							required
							class="mt-2"
							placeholder="••••••••"
						/>
					</div>
				{/if}

				<!-- Submit Button -->
				<div class="pt-4">
					<ShimmerButton type="submit" {loading} disabled={loading} class="w-full">
						{loading
							? (isSignUp ? t('auth.creatingAccount') : t('auth.signingIn'))
							: isSignUp
								? t('auth.signUp')
								: t('auth.signIn')}
					</ShimmerButton>
				</div>
			</form>

			<!-- Toggle Link -->
			<div class="mt-6 text-center text-sm">
				<span class="text-muted-foreground">
					{isSignUp ? t('auth.alreadyHaveAccount') + ' ' : t('auth.dontHaveAccount') + ' '}
				</span>
				<button
					onclick={() => {
						isSignUp = !isSignUp;
						error = '';
					}}
					class="text-cyan-600 dark:text-cyan-400 hover:underline font-medium transition-colors"
				>
					{isSignUp ? t('auth.switchToSignIn') : t('auth.switchToSignUp')}
				</button>
			</div>
		</div>
	</ShineBorder>
</div>

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.animate-fade-in {
		animation: fadeIn 0.3s ease-out;
	}
</style>