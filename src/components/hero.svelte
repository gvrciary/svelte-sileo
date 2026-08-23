<script lang="ts">
	import InstallCommand from './install-command.svelte';
	import { sileo } from "$lib";
	import LaunchToast from "./utils/launch-toast.svelte";

	function showExample() {
		sileo.action({
			title: "Sileo for Svelte is out",
			description: LaunchToast,
			fill: "#242424",
			styles: {
				title: "text-white!",
				description: "text-white/85!",
				badge: "bg-white/12!",
				button: "bg-white/12! text-white! hover:bg-white/20!",
			},
			button: {
				title: "Try it",
				onClick: () =>
					sileo.success({
						title: "Sileo is working perfectly.",
						fill: "#242424",
						styles: {
							title: "text-white!",
						},
					}),
			},
		});
	}
</script>

	<main class="flex flex-col items-center pt-24 pb-8">
		<h1 class="text-5xl sm:text-7xl font-semibold tracking-tighter whitespace-nowrap">
			Svelte-Sileo<span class="text-neutral-300">.</span>
		</h1>
		<p class="mt-3 text-sm font-medium text-neutral-300 text-center tracking-wide">
			Svelte toast library for Svelte 5 apps
		</p>

		<p class="mt-5 text-[15px] text-neutral-400 text-center max-w-md leading-relaxed text-pretty">
			A physics-based toast library for Svelte with gooey SVG morphing, promise flows, inline actions,
			and a minimal API that stays easy to ship.
		</p>

	<div class="flex flex-col items-center gap-5 mt-8">
		<div class="flex flex-wrap items-center justify-center gap-2">
			<button
				type="button"
				onclick={showExample}
				class="group inline-flex items-center cursor-pointer justify-center gap-2 h-10 px-4 rounded-xl text-sm font-medium bg-foreground text-background hover:opacity-90 active:scale-[0.96] transition-[transform,opacity] duration-300 ease-out"
			>
				Show Example
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="12"
					height="12"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="transition-transform duration-300 ease-out group-hover:translate-x-0.5"
				>
					<path d="M5 12h14"></path>
					<path d="m12 5 7 7-7 7"></path>
				</svg>
			</button>
			<a
				href="https://github.com/alexisgvrcia/svelte-sileo"
				target="_blank"
				rel="noopener noreferrer"
				class="group inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-sm font-medium bg-accent text-foreground hover:bg-accent-hover active:scale-[0.96] transition-[transform,background-color,color] duration-300 ease-out"
			>
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="transition-opacity duration-300 ease-out group-hover:opacity-85"
				>
					<path
						d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
					/>
				</svg>
				GitHub
			</a>
		</div>
		<InstallCommand />
	</div>
</main>
