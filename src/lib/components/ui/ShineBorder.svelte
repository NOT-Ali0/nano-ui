<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		borderRadius?: string;
		borderWidth?: string;
		duration?: string;
		intensity?: number;
		children?: Snippet;
	}

	let {
		class: className = '',
		borderRadius = '1rem',
		borderWidth = '2px',
		duration = '3s',
		intensity = 0.6,
		children,
		...restProps
	}: Props = $props();
</script>

<div
	class={cn('relative shine-border-wrapper', className)}
	style="--border-radius: {borderRadius}; --border-width: {borderWidth}; --duration: {duration}; --intensity: {intensity};"
	{...restProps}
>
	<!-- Base border with existing cyan/teal gradient colors - preserved from original -->
	<div
		class="absolute inset-0 base-border rounded-[var(--border-radius)]"
		style="background: linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6, #06b6d4); background-size: 300% 300%; border-radius: var(--border-radius);"
	></div>
	
	<!-- Animated shine overlay that moves diagonally across the border -->
	<div
		class="absolute inset-0 shine-overlay rounded-[var(--border-radius)]"
		style="border-radius: var(--border-radius);"
	></div>
	
	<!-- Content wrapper with inner background to create border effect -->
	<div class="relative shine-content bg-white dark:bg-card rounded-[calc(var(--border-radius)-var(--border-width))] m-[var(--border-width)]">
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>

<style>
	.shine-border-wrapper {
		border-radius: var(--border-radius);
	}

	.base-border {
		z-index: 0;
		padding: var(--border-width);
		-webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		animation: gradient-shift calc(var(--duration) * 2) ease infinite;
	}

	.shine-overlay {
		z-index: 1;
		overflow: hidden;
		pointer-events: none;
		padding: var(--border-width);
		-webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
	}

	.shine-overlay::before {
		content: '';
		position: absolute;
		top: -100%;
		left: -100%;
		width: 300%;
		height: 300%;
		background: radial-gradient(
			ellipse at center,
			transparent 0%,
			transparent 35%,
			rgba(6, 182, 212, calc(var(--intensity) * 0.8)) 40%,
			rgba(59, 130, 246, calc(var(--intensity) * 1.2)) 50%,
			rgba(139, 92, 246, calc(var(--intensity) * 1)) 60%,
			rgba(6, 182, 212, calc(var(--intensity) * 0.8)) 70%,
			transparent 100%
		);
		filter: blur(25px) brightness(1.4);
		animation: shine var(--duration) ease-in-out infinite;
		mix-blend-mode: screen;
	}

	.shine-content {
		z-index: 2;
	}

	@keyframes gradient-shift {
		0%, 100% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
	}

	@keyframes shine {
		0% {
			transform: translate(-150%, -150%) rotate(45deg);
			opacity: 0;
		}
		10% {
			opacity: var(--intensity);
		}
		90% {
			opacity: var(--intensity);
		}
		100% {
			transform: translate(150%, 150%) rotate(45deg);
			opacity: 0;
		}
	}
</style>