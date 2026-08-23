<script lang="ts">
    import firaCodeLatin from "@fontsource-variable/fira-code/files/fira-code-latin-wght-normal.woff2?url";
    import geistLatin from "@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url";
    import { Toaster } from "$lib";
    import "./layout.css";

    let { children } = $props();
</script>

<svelte:head>
    <link rel="preload" href={geistLatin} as="font" type="font/woff2" crossorigin="anonymous" />
    <link rel="preload" href={firaCodeLatin} as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

<Toaster
    offset={8}
    options={{
        fill: "#ffffff",
        styles: {
            description: "text-black/60!",
        },
    }}
/>

{@render children()}
