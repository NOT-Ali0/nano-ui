<script lang="ts">
	import Card from '../ui/Card.svelte';

	interface Props {
		title: string;
		value: string | number;
		subtitle?: string;
		icon?: any;
		class?: string;
	}

	let { title, value, subtitle, icon, class: className = '' }: Props = $props();
</script>

<Card class={className}>
	<div class="p-6">
		<div class="flex items-center justify-between">
			<div>
				<p class="text-sm font-medium text-muted-foreground">{title}</p>
				<p class="text-2xl font-bold mt-2">{value}</p>
				{#if subtitle}
					<p class="text-xs text-muted-foreground mt-1">{subtitle}</p>
				{/if}
			</div>
			{#if icon}
				<div class="text-muted-foreground">{@render icon()}</div>
			{/if}
		</div>
	</div>
</Card>

