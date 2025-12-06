<script lang="ts">
	import { t } from '$lib/i18n';
	import { cn } from '$lib/utils';

	interface Props {
		onFileSelect?: (file: File) => void;
		disabled?: boolean;
		class?: string;
	}

	let {
		onFileSelect,
		disabled = false,
		class: className = ''
	}: Props = $props();

	let isDragging = $state(false);
	let fileInput: HTMLInputElement;

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		if (!disabled) {
			isDragging = true;
		}
	}

	function handleDragLeave() {
		isDragging = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		if (disabled) return;

		const files = e.dataTransfer?.files;
		if (files && files.length > 0) {
			handleFile(files[0]);
		}
	}

	function handleFileSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		const files = target.files;
		if (files && files.length > 0) {
			handleFile(files[0]);
		}
	}

	function handleFile(file: File) {
		// Validate file type
		const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
		if (!validTypes.includes(file.type)) {
			alert(t('uploadArea.invalidFileType'));
			return;
		}

		// Validate file size (max 10MB)
		if (file.size > 10 * 1024 * 1024) {
			alert(t('uploadArea.fileTooLarge'));
			return;
		}

		onFileSelect?.(file);
	}

	function triggerFileInput() {
		if (!disabled) {
			fileInput?.click();
		}
	}
</script>

<div
	class={cn(
		'border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer',
		isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50',
		disabled && 'opacity-50 cursor-not-allowed',
		className
	)}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
	onclick={triggerFileInput}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			triggerFileInput();
		}
	}}
	role="button"
	tabindex="0"
>
	<input
		bind:this={fileInput}
		type="file"
		accept="image/png,image/jpeg,image/jpg,application/pdf"
		onchange={handleFileSelect}
		class="hidden"
		{disabled}
	/>
	<div class="flex flex-col items-center gap-4">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-12 w-12 text-muted-foreground"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
			/>
		</svg>
		<div>
			<p class="text-lg font-medium">
				{isDragging ? t('uploadArea.dropHere') : t('uploadArea.dragDrop')}
			</p>
			<p class="text-sm text-muted-foreground mt-2">{t('uploadArea.clickToBrowse')}</p>
			<p class="text-xs text-muted-foreground mt-2">{t('uploadArea.fileTypes')}</p>
		</div>
	</div>
</div>

