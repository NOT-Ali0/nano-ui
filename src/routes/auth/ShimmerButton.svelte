<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		loading?: boolean;
		children?: Snippet;
		onclick?: (e: MouseEvent) => void;
	}

	let {
		class: className = '',
		type = 'button',
		disabled = false,
		loading = false,
		children,
		onclick,
		...restProps
	}: Props = $props();
</script>

<button
	{type}
	class={cn(
		'group relative inline-flex items-center justify-center overflow-hidden rounded-md px-6 py-3 font-medium text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
		'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700',
		'shadow-lg hover:shadow-xl hover:shadow-cyan-500/50',
		className
	)}
	{disabled}
	{onclick}
	{...restProps}
>
	<!-- Shimmer effect -->
	<span
		class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000"
	></span>
	
	<!-- Button content -->
	<span class="relative flex items-center justify-center gap-2">
		{#if loading}
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
		{/if}
		{#if children}
			{@render children()}
		{/if}
	</span>
</button>
