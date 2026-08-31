<script lang="ts">
	import { sileo } from "$lib";
	import { SILEO_POSITIONS, type SileoPosition } from "$lib/types";

	import RocketIcon from "./icons/rocket-icon.svelte";
	import PdfRecordToast from "./utils/pdf-record-toast.svelte";

	interface Props {
		position: SileoPosition;
		onpositionchange: (pos: SileoPosition) => void;
	}

	let { position, onpositionchange }: Props = $props();

	let multiple = $state(false);

	const positionLabels: Record<SileoPosition, string> = {
		"top-left": "Top Left",
		"top-center": "Top Center",
		"top-right": "Top Right",
		"bottom-left": "Bottom Left",
		"bottom-center": "Bottom Center",
		"bottom-right": "Bottom Right",
	};

	const demos: { id: string; label: string; action: () => void }[] = [
		{
			id: "success",
			label: "Success",
			action: () => sileo.success({ title: "Changes saved" }),
		},
		{
			id: "error",
			label: "Error",
			action: () =>
				sileo.error({
					title: "Something went wrong",
					description: "Please try again later.",
				}),
		},
		{
			id: "warning",
			label: "Warning",
			action: () => sileo.warning({ title: "Storage almost full" }),
		},
		{
			id: "info",
			label: "Info",
			action: () => sileo.info({ title: "New update available" }),
		},
		{
			id: "action",
			label: "Action",
			action: () =>
				sileo.action({
					title: "File uploaded",
					description: "Share it with your team?",
					button: {
						title: "Share",
						onClick: () => sileo.success({ title: "Shared!" }),
					},
				}),
		},
		{
			id: "loading",
			label: "Loading",
			action: () => {
				const id = sileo.loading({ title: "Uploading..." });
				setTimeout(() => {
					sileo.success({ id, title: "Upload complete" });
				}, 2000);
			},
		},
		{
			id: "icon",
			label: "Icon",
			action: () =>
				sileo.success({
					title: "Deployed",
					icon: RocketIcon,
				}),
		},
		{
			id: "promise",
			label: "Promise",
			action: () => {
				sileo.promise(new Promise((r) => setTimeout(r, 2000)), {
					loading: { title: "Saving record..." },
					success: {
						title: "Record saved",
						description: PdfRecordToast,
						button: {
							title: "Download",
							onClick: () =>
								sileo.success({ title: "Download started!" }),
						},
					},
					error: { title: "Failed to save" },
				});
			},
		},
	];

	$effect(() => {
		sileo.setMultiple(multiple);
	});

	function handleModeChange(enabled: boolean) {
		if (multiple === enabled) return;
		sileo.clear();
		sileo.setMultiple(enabled);
		multiple = enabled;
	}

	function handleDemo(demo: (typeof demos)[number]) {
		demo.action();
	}
</script>

	<div class="flex flex-col items-center gap-8 pb-8">
	<div class="w-full max-w-xl">
		<p
			class="text-[11px] text-neutral-300 tracking-widest uppercase font-medium text-center mb-3"
		>
			Playground
		</p>
		<div class="p-4 flex items-center justify-center gap-2 flex-wrap">
			{#each demos as demo}
				<button
					type="button"
					class="inline-flex items-center justify-center font-medium cursor-pointer h-9 px-4 rounded-xl text-xs bg-accent text-muted-foreground hover:bg-accent-hover hover:text-foreground active:scale-[0.96] transition-[transform,background-color,color] duration-250 ease-out"
					onclick={() => handleDemo(demo)}
				>
					{demo.label}
				</button>
			{/each}
		</div>
	</div>

	<div class="flex flex-col items-center gap-3">
		<p
			class="text-[11px] text-neutral-300 tracking-widest uppercase font-medium"
		>
			Mode
		</p>
		<div class="flex items-center justify-center gap-2 px-6 rounded-2xl bg-accent/20 p-1">
			<button
				type="button"
				class="inline-flex items-center justify-center font-medium cursor-pointer h-9 px-4 rounded-xl text-xs active:scale-[0.96] transition-[transform,background-color,color] duration-250 ease-out {!multiple
					? 'bg-foreground text-background'
					: 'bg-accent text-muted-foreground hover:bg-accent-hover hover:text-foreground'}"
				onclick={() => handleModeChange(false)}
			>
				Single
			</button>
			<button
				type="button"
				class="inline-flex items-center justify-center font-medium cursor-pointer h-9 px-4 rounded-xl text-xs active:scale-[0.96] transition-[transform,background-color,color] duration-250 ease-out {multiple
					? 'bg-foreground text-background'
					: 'bg-accent text-muted-foreground hover:bg-accent-hover hover:text-foreground'}"
				onclick={() => handleModeChange(true)}
			>
				Multiple
			</button>
		</div>
		<p class="text-[11px] text-muted-foreground text-center">
			{multiple ? "Stack mode enabled." : "Single mode enabled."}
		</p>
	</div>

	<div class="flex flex-col items-center gap-3">
		<p
			class="text-[11px] text-neutral-300 tracking-widest uppercase font-medium"
		>
			Position
		</p>
		<div class="flex flex-wrap items-center justify-center gap-2 px-6">
			{#each SILEO_POSITIONS as pos}
				<button
					type="button"
					class="inline-flex items-center justify-center font-medium cursor-pointer h-9 px-4 rounded-xl text-xs active:scale-[0.96] transition-[transform,background-color,color] duration-250 ease-out {pos ===
					position
						? 'bg-foreground text-background'
						: 'bg-accent text-muted-foreground hover:bg-accent-hover hover:text-foreground'}"
					onclick={() => onpositionchange(pos)}
				>
					{positionLabels[pos]}
				</button>
			{/each}
		</div>
		<p class="text-[11px] text-muted-foreground text-center mt-2">
			Available positions: {SILEO_POSITIONS.join(", ")}.
		</p>
	</div>
</div>
