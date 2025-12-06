<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { langStore } from '$lib/stores/langStore';
	import { cn } from '$lib/utils';

	let isOpen = $state(false);
	let dropdownRef: HTMLDivElement;
	let currentLang = $state<'en' | 'ar'>('en');

	langStore.subscribe((lang) => {
		currentLang = lang;
	});

	onMount(() => {
		currentLang = get(langStore);
		document.addEventListener('click', handleClickOutside);
		document.addEventListener('keydown', handleEscape);
		return () => {
			document.removeEventListener('click', handleClickOutside);
			document.removeEventListener('keydown', handleEscape);
		};
	});

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function selectLanguage(lang: 'en' | 'ar') {
		langStore.set(lang);
		isOpen = false;
	}

	function handleClickOutside(event: MouseEvent) {
		if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
			isOpen = false;
		}
	}

	function handleEscape(event: KeyboardEvent) {
		if (event.key === 'Escape' && isOpen) {
			isOpen = false;
		}
	}
</script>

<div class="relative" bind:this={dropdownRef}>
	<!-- shadcn-style Button -->
	<button
		type="button"
		onclick={toggleDropdown}
		class={cn(
			'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
			'h-10 px-3 py-2',
			'hover:bg-accent hover:text-accent-foreground',
			isOpen && 'bg-accent text-accent-foreground'
		)}
		aria-label="Change language"
		aria-expanded={isOpen}
		aria-haspopup="true"
	>
		<span class="text-lg" aria-hidden="true">{currentLang === 'ar' ? '🇸🇦' : '🇺🇸'}</span>
		<span class="hidden sm:inline">{currentLang === 'ar' ? 'العربية' : 'English'}</span>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class={cn('h-4 w-4 transition-transform duration-200', isOpen && 'rotate-180')}
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="2"
			aria-hidden="true"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
		</svg>
	</button>

	<!-- shadcn-style Dropdown Menu -->
	{#if isOpen}
		<div
			class={cn(
				'absolute top-full mt-1.5 right-0 rtl:right-auto rtl:left-0',
				'z-50 min-w-[180px] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md',
				'animate-in fade-in-0 zoom-in-95'
			)}
			role="menu"
			aria-orientation="vertical"
		>
			<div class="p-1">
				<button
					type="button"
					onclick={() => selectLanguage('en')}
					class={cn(
						'relative flex w-full items-center gap-3 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
						'focus:bg-accent focus:text-accent-foreground',
						'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
						currentLang === 'en' && 'bg-accent text-accent-foreground'
					)}
					role="menuitem"
					data-disabled={false}
				>
					<span class="text-lg flex-shrink-0" aria-hidden="true">🇺🇸</span>
					<span class="flex-1 text-left rtl:text-right">English</span>
					{#if currentLang === 'en'}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4 text-primary ml-auto rtl:ml-0 rtl:mr-auto"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
						</svg>
					{/if}
				</button>
				<button
					type="button"
					onclick={() => selectLanguage('ar')}
					class={cn(
						'relative flex w-full items-center gap-3 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
						'focus:bg-accent focus:text-accent-foreground',
						'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
						currentLang === 'ar' && 'bg-accent text-accent-foreground'
					)}
					role="menuitem"
					data-disabled={false}
				>
					<span class="text-lg flex-shrink-0" aria-hidden="true">🇸🇦</span>
					<span class="flex-1 text-left rtl:text-right">العربية</span>
					{#if currentLang === 'ar'}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4 text-primary ml-auto rtl:ml-0 rtl:mr-auto"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
						</svg>
					{/if}
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	@keyframes fade-in-0 {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes zoom-in-95 {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}

	.animate-in {
		animation-duration: 150ms;
		animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
		animation-fill-mode: both;
	}

	.fade-in-0 {
		animation-name: fade-in-0;
	}

	.zoom-in-95 {
		animation-name: zoom-in-95;
	}
</style>

