<script lang="ts">
	import { onMount } from 'svelte';
	import { cn } from '$lib/utils';

	interface Props {
		text: string;
		for?: string;
		class?: string;
		delay?: number;
		stagger?: number;
	}

	let {
		text,
		for: labelFor,
		class: className = '',
		delay = 0,
		stagger = 0.03
	}: Props = $props();

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});
</script>

<label
	for={labelFor}
	class={cn('block text-sm font-medium mb-2 text-foreground', className)}
>
	{#if mounted}
		{#each text.split('') as char, index}
			<span
				class="animated-char"
				style="animation-delay: {(delay + index * stagger) * 1000}ms;"
			>
				{char === ' ' ? '\u00A0' : char}
			</span>
		{/each}
	{:else}
		{text}
	{/if}
</label>

<style>
	@keyframes blurInUp {
		from {
			opacity: 0;
			transform: translateY(10px);
			filter: blur(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
			filter: blur(0);
		}
	}

	.animated-char {
		display: inline-block;
		animation: blurInUp 0.4s ease-out forwards;
		opacity: 0;
	}
</style>
