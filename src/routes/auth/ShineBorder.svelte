<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		borderRadius?: string;
		duration?: number;
		colorStops?: string[];
		children?: Snippet;
	}

	let {
		class: className = '',
		borderRadius = '1rem',
		duration = 3,
		colorStops = ['#06b6d4', '#3b82f6', '#8b5cf6', '#06b6d4'],
		children,
		...restProps
	}: Props = $props();

	let gradientString = $derived.by(() => colorStops.join(', '));
</script>

<div
	class={cn('relative shine-border-wrapper', className)}
	style="--duration: {duration}s; --border-radius: {borderRadius};"
	{...restProps}
>
	<!-- Animated gradient background (acts as border) -->
	<div
		class="absolute inset-0 shine-gradient rounded-[var(--border-radius)]"
		style="background: linear-gradient(90deg, {gradientString}); background-size: 300% 300%; animation: shine var(--duration) ease infinite;"
	></div>
	
	<!-- Content wrapper with inner background to create border effect -->
	<div class="relative shine-content bg-white dark:bg-card rounded-[calc(var(--border-radius)-2px)] m-[2px]">
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>

<style>
	.shine-border-wrapper {
		border-radius: var(--border-radius);
	}

	.shine-gradient {
		z-index: 0;
	}

	.shine-content {
		z-index: 1;
	}

	@keyframes shine {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
</style>
