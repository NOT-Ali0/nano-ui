<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	let progress = $state<number>(0);
	let mounted = $state(false);

	function calculateProgress(): void {
		if (!browser || typeof window === 'undefined') return;

		const scrollY = window.scrollY;
		const documentHeight = document.documentElement.scrollHeight;
		const viewportHeight = window.innerHeight;
		const scrollableHeight = documentHeight - viewportHeight;

		if (scrollableHeight <= 0) {
			progress = 0;
			return;
		}

		progress = Math.min(100, Math.max(0, (scrollY / scrollableHeight) * 100));
	}

	function handleScroll(): void {
		if (!browser) return;
		requestAnimationFrame(calculateProgress);
	}

	onMount(() => {
		if (!browser) return;
		
		mounted = true;
		
		// Calculate initial progress
		calculateProgress();

		// Add scroll event listener
		window.addEventListener('scroll', handleScroll, { passive: true });

		// Handle resize events to recalculate if content changes
		window.addEventListener('resize', calculateProgress, { passive: true });
	});

	onDestroy(() => {
		if (!browser) return;
		
		window.removeEventListener('scroll', handleScroll);
		window.removeEventListener('resize', calculateProgress);
	});
</script>

{#if mounted}
	<div class="fixed top-16 left-0 w-full h-[3px] z-40 bg-transparent pointer-events-none">
		<div
			class="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 transition-[width] duration-100 ease-out"
			style="width: {progress}%"
		></div>
	</div>
{/if}

