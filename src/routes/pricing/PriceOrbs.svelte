<script lang="ts">
	import { onMount } from 'svelte';

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});
</script>

{#if mounted}
	<div class="fixed inset-0 overflow-hidden pointer-events-none -z-10">
		<!-- Orb 1 - Top Left -->
		<div
			class="absolute w-96 h-96 rounded-full blur-3xl opacity-30 dark:opacity-40 animate-float-1"
			style="background: radial-gradient(circle, rgba(59, 130, 246, 0.4), rgba(147, 51, 234, 0.2)); top: -10%; left: -10%;"
		></div>

		<!-- Orb 2 - Top Right -->
		<div
			class="absolute w-80 h-80 rounded-full blur-3xl opacity-25 dark:opacity-35 animate-float-2"
			style="background: radial-gradient(circle, rgba(34, 211, 238, 0.4), rgba(59, 130, 246, 0.2)); top: 10%; right: -5%;"
		></div>

		<!-- Orb 3 - Bottom Left -->
		<div
			class="absolute w-72 h-72 rounded-full blur-3xl opacity-20 dark:opacity-30 animate-float-3"
			style="background: radial-gradient(circle, rgba(147, 51, 234, 0.3), rgba(34, 211, 238, 0.2)); bottom: -5%; left: 5%;"
		></div>

		<!-- Orb 4 - Bottom Right -->
		<div
			class="absolute w-88 h-88 rounded-full blur-3xl opacity-25 dark:opacity-35 animate-float-4"
			style="background: radial-gradient(circle, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.2)); bottom: -10%; right: -10%;"
		></div>

		<!-- Orb 5 - Center -->
		<div
			class="absolute w-64 h-64 rounded-full blur-3xl opacity-15 dark:opacity-25 animate-float-5"
			style="background: radial-gradient(circle, rgba(34, 211, 238, 0.3), rgba(59, 130, 246, 0.2)); top: 50%; left: 50%; transform: translate(-50%, -50%);"
		></div>
	</div>
{/if}

<style>
	@keyframes float-1 {
		0%,
		100% {
			transform: translate(0, 0) scale(1);
		}
		25% {
			transform: translate(30px, -30px) scale(1.1);
		}
		50% {
			transform: translate(-20px, 20px) scale(0.9);
		}
		75% {
			transform: translate(20px, 30px) scale(1.05);
		}
	}

	@keyframes float-2 {
		0%,
		100% {
			transform: translate(0, 0) scale(1);
		}
		25% {
			transform: translate(-25px, 25px) scale(0.95);
		}
		50% {
			transform: translate(25px, -25px) scale(1.1);
		}
		75% {
			transform: translate(-15px, -20px) scale(0.9);
		}
	}

	@keyframes float-3 {
		0%,
		100% {
			transform: translate(0, 0) scale(1);
		}
		25% {
			transform: translate(20px, -20px) scale(1.05);
		}
		50% {
			transform: translate(-30px, 30px) scale(0.9);
		}
		75% {
			transform: translate(25px, 15px) scale(1.1);
		}
	}

	@keyframes float-4 {
		0%,
		100% {
			transform: translate(0, 0) scale(1);
		}
		25% {
			transform: translate(-30px, -25px) scale(0.95);
		}
		50% {
			transform: translate(20px, 25px) scale(1.1);
		}
		75% {
			transform: translate(-20px, 20px) scale(0.9);
		}
	}

	@keyframes float-5 {
		0%,
		100% {
			transform: translate(-50%, -50%) scale(1);
		}
		25% {
			transform: translate(-45%, -55%) scale(1.1);
		}
		50% {
			transform: translate(-55%, -45%) scale(0.9);
		}
		75% {
			transform: translate(-50%, -50%) scale(1.05);
		}
	}

	.animate-float-1 {
		animation: float-1 20s ease-in-out infinite;
	}

	.animate-float-2 {
		animation: float-2 18s ease-in-out infinite;
		animation-delay: -2s;
	}

	.animate-float-3 {
		animation: float-3 22s ease-in-out infinite;
		animation-delay: -4s;
	}

	.animate-float-4 {
		animation: float-4 19s ease-in-out infinite;
		animation-delay: -6s;
	}

	.animate-float-5 {
		animation: float-5 21s ease-in-out infinite;
		animation-delay: -8s;
	}

	@media (prefers-reduced-motion: reduce) {
		.animate-float-1,
		.animate-float-2,
		.animate-float-3,
		.animate-float-4,
		.animate-float-5 {
			animation: none;
		}
	}
</style>

