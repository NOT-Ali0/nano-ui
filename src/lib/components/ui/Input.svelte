<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		type?: string;
		class?: string;
		placeholder?: string;
		disabled?: boolean;
		value?: string;
		id?: string;
		required?: boolean;
		maxlength?: number;
	}

	let {
		type = 'text',
		class: className = '',
		placeholder = '',
		disabled = false,
		value = $bindable(''),
		id,
		required = false,
		maxlength,
		...restProps
	}: Props = $props();
</script>

<input
	{type}
	{id}
	{placeholder}
	{disabled}
	{required}
	{maxlength}
	bind:value
	class={cn(
		'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	{...restProps}
/>

