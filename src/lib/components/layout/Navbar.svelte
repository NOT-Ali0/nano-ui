<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/authStore';
	import { t } from '$lib/i18n';
	import Button from '../ui/Button.svelte';
	import LanguageToggle from '../LanguageToggle.svelte';
	import ThemeToggler from '../ThemeToggler.svelte';
	import { Menu, X } from 'lucide-svelte';

	let authState = $state<{ isAuthenticated: boolean; user: any }>({ isAuthenticated: false, user: null });
	let mobileMenuOpen = $state(false);

	authStore.subscribe((state) => {
		authState = state;
	});

	let isAuthenticated = $derived(authState.isAuthenticated);
	let user = $derived(authState.user);

	function handleLogout() {
		authStore.logout();
		goto('/');
		closeMobileMenu();
	}

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
		if (typeof document !== 'undefined') {
			if (mobileMenuOpen) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = '';
			}
		}
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
		if (typeof document !== 'undefined') {
			document.body.style.overflow = '';
		}
	}

	function handleLinkClick() {
		closeMobileMenu();
	}

	// Close menu on escape key
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && mobileMenuOpen) {
			closeMobileMenu();
		}
	}

	onMount(() => {
		if (typeof document !== 'undefined') {
			document.addEventListener('keydown', handleKeydown);
		}
	});

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.removeEventListener('keydown', handleKeydown);
			document.body.style.overflow = '';
		}
	});
</script>

<nav class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<div class="flex items-center gap-8">
				<a href="/" class="flex items-center gap-2 font-bold text-xl">
					<span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
						{t('navbar.brand')}
					</span>
				</a>
				{#if isAuthenticated}
					<div class="hidden md:flex items-center gap-6">
						<a href="/upload" class="text-sm font-medium hover:text-primary transition-colors">
							{t('navbar.upload')}
						</a>
						<a href="/dashboard" class="text-sm font-medium hover:text-primary transition-colors">
							{t('navbar.dashboard')}
						</a>
						<a href="/docs" class="text-sm font-medium hover:text-primary transition-colors">
							{t('navbar.docs')}
						</a>
					</div>
				{/if}
			</div>
			<div class="flex items-center gap-4">
				<!-- Desktop menu items -->
				<div class="hidden md:flex items-center gap-4">
					<LanguageToggle />
					<ThemeToggler />
					{#if isAuthenticated}
						<div class="flex items-center gap-4">
							<span class="text-sm text-muted-foreground">{user?.name}</span>
							<Button variant="ghost" size="sm" onclick={handleLogout}>{t('navbar.logout')}</Button>
						</div>
					{:else}
						<div class="flex items-center gap-2">
							<Button variant="ghost" size="sm" onclick={() => goto('/auth')}>{t('navbar.signIn')}</Button>
							<Button variant="default" size="sm" onclick={() => goto('/auth')}>{t('navbar.getStarted')}</Button>
						</div>
					{/if}
				</div>
				<!-- Mobile menu button -->
				<button
					class="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
					onclick={toggleMobileMenu}
					aria-label="Toggle mobile menu"
					aria-expanded={mobileMenuOpen}
				>
					{#if mobileMenuOpen}
						<X class="h-6 w-6" />
					{:else}
						<Menu class="h-6 w-6" />
					{/if}
				</button>
			</div>
		</div>
	</div>
</nav>

<!-- Mobile menu overlay -->
{#if mobileMenuOpen}
	<div
		class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
		onclick={closeMobileMenu}
		transition:fade={{ duration: 200 }}
		role="button"
		tabindex="-1"
		aria-label="Close menu"
	></div>
{/if}

<!-- Mobile slide menu -->
<div
	class="mobile-menu fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-background border-l shadow-xl z-50 md:hidden transform transition-transform duration-300 ease-out {mobileMenuOpen
		? 'translate-x-0'
		: 'translate-x-full'}"
	role="dialog"
	aria-modal="true"
	aria-label="Mobile navigation menu"
>
	<div class="flex flex-col h-full">
		<!-- Mobile menu header -->
		<div class="flex items-center justify-between p-4 border-b">
			<span class="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
				{t('navbar.brand')}
			</span>
			<button
				class="p-2 rounded-md hover:bg-muted transition-colors"
				onclick={closeMobileMenu}
				aria-label="Close menu"
			>
				<X class="h-6 w-6" />
			</button>
		</div>

		<!-- Mobile menu content -->
		<div class="flex-1 overflow-y-auto p-4">
			{#if isAuthenticated}
				<div class="space-y-4">
					<!-- User info -->
					<div class="pb-4 border-b">
						<p class="text-sm text-muted-foreground mb-1">{t('navbar.welcome') || 'Welcome'}</p>
						<p class="font-medium">{user?.name || user?.email}</p>
					</div>

					<!-- Navigation links -->
					<nav class="space-y-2">
						<a
							href="/upload"
							onclick={handleLinkClick}
							class="block px-4 py-3 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
						>
							{t('navbar.upload')}
						</a>
						<a
							href="/dashboard"
							onclick={handleLinkClick}
							class="block px-4 py-3 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
						>
							{t('navbar.dashboard')}
						</a>
						<a
							href="/docs"
							onclick={handleLinkClick}
							class="block px-4 py-3 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
						>
							{t('navbar.docs')}
						</a>
					</nav>
				</div>
			{/if}

			<!-- Settings section -->
			<div class="mt-6 pt-6 border-t space-y-4">
				<div class="flex items-center justify-between px-4">
					<span class="text-sm font-medium">{t('navbar.language') || 'Language'}</span>
					<LanguageToggle />
				</div>
				<div class="flex items-center justify-between px-4">
					<span class="text-sm font-medium">{t('navbar.theme') || 'Theme'}</span>
					<ThemeToggler />
				</div>
			</div>

			<!-- Auth buttons -->
			<div class="mt-6 pt-6 border-t space-y-2">
				{#if isAuthenticated}
					<Button
						variant="ghost"
						class="w-full justify-start"
						onclick={handleLogout}
					>
						{t('navbar.logout')}
					</Button>
				{:else}
					<Button
						variant="ghost"
						class="w-full justify-start"
						onclick={() => {
							goto('/auth');
							handleLinkClick();
						}}
					>
						{t('navbar.signIn')}
					</Button>
					<Button
						variant="default"
						class="w-full"
						onclick={() => {
							goto('/auth');
							handleLinkClick();
						}}
					>
						{t('navbar.getStarted')}
					</Button>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	/* RTL support for mobile menu */
	:global(html.rtl .mobile-menu) {
		right: auto;
		left: 0;
		border-left: none;
		border-right: 1px solid hsl(var(--border));
	}

	:global(html.rtl .mobile-menu.translate-x-full) {
		transform: translateX(-100%);
	}

	:global(html.rtl .mobile-menu.translate-x-0) {
		transform: translateX(0);
	}
</style>

