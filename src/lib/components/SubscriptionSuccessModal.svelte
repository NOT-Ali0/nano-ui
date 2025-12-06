<script lang="ts">
	import Modal from '$lib/components/ui/Modal.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	interface Props {
		open?: boolean;
		planName?: string;
		onClose?: () => void;
	}

	let { open = $bindable(false), planName = 'Pro', onClose }: Props = $props();

	function handleClose() {
		open = false;
		if (onClose) {
			onClose();
		}
	}
</script>

<Modal bind:open={open} on:close={handleClose}>
	<div class="text-center py-6">
		<!-- Success Icon -->
		<div class="mb-6 flex justify-center">
			<div
				class="relative w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center animate-scale-in"
			>
				<svg
					class="w-12 h-12 text-white"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="3"
						d="M5 13l4 4L19 7"
					/>
				</svg>
				<!-- Animated rings -->
				<div
					class="absolute inset-0 rounded-full border-4 border-green-400/30 animate-ping"
				></div>
				<div
					class="absolute inset-0 rounded-full border-4 border-green-400/20 animate-pulse"
				></div>
			</div>
		</div>

		<!-- Title -->
		<h2
			class="text-3xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
		>
			🎉 Subscription Successful!
		</h2>

		<!-- Message -->
		<p class="text-lg text-muted-foreground mb-2">
			You are now subscribed to the
		</p>
		<p
			class="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
		>
			{planName} Plan
		</p>

		<!-- Benefits -->
		<div class="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 rounded-lg p-4 mb-6">
			<p class="text-sm font-semibold text-foreground mb-3">✨ Your new benefits:</p>
			<ul class="space-y-2 text-left text-sm text-muted-foreground">
				<li class="flex items-center gap-2">
					<svg
						class="w-5 h-5 text-green-500 flex-shrink-0"
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
					<span>Unlimited image uploads</span>
				</li>
				<li class="flex items-center gap-2">
					<svg
						class="w-5 h-5 text-green-500 flex-shrink-0"
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
					<span>High-accuracy OCR processing</span>
				</li>
				<li class="flex items-center gap-2">
					<svg
						class="w-5 h-5 text-green-500 flex-shrink-0"
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
					<span>Full access to all features</span>
				</li>
				{#if planName === 'Premium'}
					<li class="flex items-center gap-2">
						<svg
							class="w-5 h-5 text-green-500 flex-shrink-0"
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
						<span>Priority support & team features</span>
					</li>
				{/if}
			</ul>
		</div>

		<!-- CTA Button -->
		<Button variant="subscribe" class="w-full" onclick={handleClose}>
			Start Uploading Now! 🚀
		</Button>
	</div>
</Modal>

<style>
	@keyframes scale-in {
		from {
			transform: scale(0);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	.animate-scale-in {
		animation: scale-in 0.5s ease-out;
	}

	@media (prefers-reduced-motion: reduce) {
		.animate-scale-in {
			animation: none;
		}
	}
</style>

