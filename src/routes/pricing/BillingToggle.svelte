<script lang="ts">
	import { t } from '$lib/i18n';

	interface Props {
		isAnnual?: boolean;
	}

	let { isAnnual = $bindable(false) }: Props = $props();
</script>

<div class="flex items-center gap-4">
	<span
		class="text-sm font-medium transition-colors duration-200"
		class:text-foreground={!isAnnual}
		class:text-muted-foreground={isAnnual}
	>
		{t('pricing.monthly')}
	</span>

	<!-- Toggle Switch -->
	<button
		type="button"
		role="switch"
		aria-checked={isAnnual}
		onclick={() => (isAnnual = !isAnnual)}
		class="relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 bg-gray-300 dark:bg-gray-600"
		class:bg-cyan-500={isAnnual}
		class:dark:bg-cyan-500={isAnnual}
	>
		<!-- Sliding Indicator -->
		<span
			class="inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 translate-x-1 rtl:-translate-x-1"
			class:translate-x-9={isAnnual}
			class:rtl:-translate-x-9={isAnnual}
		></span>
	</button>

	<span
		class="text-sm font-medium transition-colors duration-200"
		class:text-foreground={isAnnual}
		class:text-muted-foreground={!isAnnual}
	>
		{t('pricing.annual')}
	</span>
</div>

