<div align="center">

https://github.com/user-attachments/assets/b9da913b-36ef-4b14-853b-3889db112de8

# Svelte-Sileo

![SvelteKit](https://img.shields.io/badge/SvelteKit-111111?style=for-the-badge&logo=svelte&logoColor=FF3E00)
![TypeScript](https://img.shields.io/badge/TypeScript-111111?style=for-the-badge&logo=typescript&logoColor=3178C6)

</div>

## What is Svelte-Sileo?

An opinionated toast component for Svelte. Gooey SVG morphing, spring physics, and a minimal API — beautiful by default.

> A Svelte port of [hiaaryan/sileo](https://github.com/hiaaryan/sileo).

### Features

- **Gooey Morphing** — SVG-based pill shape that smoothly morphs when expanding.
- **Spring Physics** — All animations driven by spring easing for a natural feel.
- **Promise API** — First-class support for async operations with loading → success/error transitions.
- **Custom Components** — Pass a Svelte component as `description` for rich toast content.
- **Custom Icons** — Swap the default state icon with any Svelte component.
- **Action Button** — Inline button with a callback, styled per toast state.
- **Autopilot** — Toasts auto-expand to show the description, then collapse before dismissing.
- **Single by default** — Replaces the current toast unless you enable `multiple`.
- **Swipe to dismiss** — Native swipe gesture support on mobile.
- **6 Positions** — `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`.
- **Fully typed** — Written in TypeScript with full type coverage.

## Installation

```bash
npm install svelte-sileo
# or
pnpm add svelte-sileo
# or
yarn add svelte-sileo
```

## Quick Start

Add `<Toaster />` to your layout. Then call `sileo` from anywhere.

```svelte
<script lang="ts">
  import { Toaster, sileo } from 'svelte-sileo';
</script>

<Toaster />

<button onclick={() => sileo.success({ title: 'Changes saved' })}>
  Toast
</button>
```

`<Toaster />` is single-toast by default. Use `<Toaster multiple />` to stack multiple toasts.

## API

### `sileo.success(opts)`

```ts
sileo.success({ title: 'Changes saved' });
```

### `sileo.error(opts)`

```ts
sileo.error({
  title: 'Something went wrong',
  description: 'Please try again later.'
});
```

### `sileo.warning(opts)`

```ts
sileo.warning({ title: 'Storage almost full' });
```

### `sileo.info(opts)`

```ts
sileo.info({ title: 'New update available' });
```

### `sileo.action(opts)`

Renders a toast with an inline action button.

```ts
sileo.action({
  title: 'File uploaded',
  description: 'Share it with your team?',
  button: {
    title: 'Share',
    onClick: () => {}
  }
});
```

### `sileo.loading(opts)`

Shows a persistent loading toast. Morph it into another state by passing its `id` to the next call.

```ts
const id = sileo.loading({ title: 'Uploading...' });

// Later, morph to success (or error, warning, etc.)
sileo.success({ id, title: 'Upload complete' });
```

`duration` defaults to `null` (persistent) so the toast stays visible until you transition or dismiss it manually.

### `sileo.promise(promise, opts)`

Starts in a loading state and transitions to success or error automatically.

```ts
sileo.promise(
  new Promise((resolve) => setTimeout(resolve, 2000)),
  {
    loading: { title: 'Saving record...' },
    success: { title: 'Record saved' },
    error:   { title: 'Failed to save' }
  }
);
```

`loading` accepts only `{ title, icon }`. Use `success`, `error`, or `action` for `description`, `button`, and style overrides.

You can also pass a function to `success` or `error` to use the resolved value or error:

```ts
sileo.promise(fetchUser(), {
  loading: { title: 'Loading user...' },
  success: (data) => ({ title: `Welcome, ${data.name}!` }),
  error:   (err)  => ({ title: `Error: ${err.message}` })
});
```

When the promise resolves you can show an `action` state instead of `success`:

```ts
sileo.promise(uploadFile(), {
  loading: { title: 'Uploading...' },
  success: { title: 'Done' },
  action:  { title: 'File ready', button: { title: 'Download', onClick: () => {} } },
  error:   { title: 'Upload failed' }
});
```

### `sileo.show(opts)`

Generic toast with no default state icon.

```ts
sileo.show({ title: 'Hello world' });
```

### `sileo.dismiss(id)`

Dismiss a specific toast by id.

```ts
const id = sileo.success({ title: 'Saved' });

sileo.dismiss(id);
```

### `sileo.clear(position?)`

Remove all toasts immediately, optionally scoped to a position.

```ts
sileo.clear();
sileo.clear('top-right');
```

## Options

Every method accepts a `SileoOptions` object:

| Option | Type | Description |
|---|---|---|
| `id` | `string` | Optional stable id for in-place updates/replacement. In single mode, omitting it uses a shared id (`sileo-default`). In multiple mode, omitting it generates a unique id. |
| `title` | `string` | Main toast text. |
| `description` | `string \| Component` | Expandable body. Accepts plain text or a Svelte component. |
| `button` | `{ title: string, onClick: () => void }` | Inline action button. |
| `icon` | `Component \| null` | Replaces the default state icon. Pass `null` to hide the icon. |
| `duration` | `number \| null` | Auto-dismiss delay in ms. `null` = persistent. Default `6000`. |
| `position` | `SileoPosition` | Overrides the `<Toaster>` position for this toast. |
| `fill` | `string` | Background fill color of the pill. Default `#FFFFFF`. |
| `roundness` | `number` | Border radius of the pill. Default `16`. |
| `autopilot` | `boolean \| { expand?: number, collapse?: number }` | Auto-expand/collapse timing. |
| `styles` | `SileoStyles` | Per-element class overrides (`title`, `description`, `badge`, `button`). |

## Toaster Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `position` | `SileoPosition` | `top-right` | Where toasts appear. |
| `offset` | `number \| string \| object` | — | Edge offset. Accepts a value or `{ top, right, bottom, left }`. |
| `multiple` | `boolean` | `false` | `false`: single-toast mode (replace current). `true`: stack multiple toasts. |
| `options` | `Partial<SileoOptions>` | — | Default options applied to every toast. |

## Single vs Multiple

Single mode is the default:

```svelte
<Toaster />
```

Multiple mode:

```svelte
<Toaster multiple />
```

## Custom Description Component

Pass any Svelte component as `description` for rich content:

```svelte
<!-- InvoiceToast.svelte -->
<div class="flex flex-col gap-2">
  <span class="text-xs opacity-50">Invoice #INV-2024-001</span>
  <span class="font-medium">$1,200.00 · 3 items</span>
</div>
```

```ts
import InvoiceToast from './InvoiceToast.svelte';

sileo.success({
  title: 'Invoice sent',
  description: InvoiceToast,
  button: { title: 'View', onClick: () => {} }
});
```

## Custom Icon

```ts
import RocketIcon from './RocketIcon.svelte';

sileo.success({
  title: 'Deployed',
  icon: RocketIcon
});
```

## Utility Methods

Sometimes you need to update global settings imperatively.

### `sileo.setPosition(position)`

Updates the toaster position dynamically.

```ts
import { sileo } from 'svelte-sileo';

sileo.setPosition('bottom-center');
```

### `sileo.setOptions(options)`

Updates the default options dynamically.

```ts
import { sileo } from 'svelte-sileo';

sileo.setOptions({ duration: 3000 });
```

### `sileo.setMultiple(enabled)`

Toggles single/multiple mode programmatically.

```ts
import { sileo } from 'svelte-sileo';

sileo.setMultiple(true);
```

 ## Styling

 Sileo is designed to look great out of the box. When you need to customize, there are a few escape hatches.

 ### Fill Color

 The `fill` prop sets the SVG background color of the toast. The default is `#FFFFFF`. Set it to a dark color like `#171717` or `black` to create a dark toast — just make sure to pair it with light text via `styles`.

 ```ts
 sileo.success({
   title: 'Dark Mode',
   fill: '#171717',
   styles: {
     title: 'text-white'
   }
 });
 ```

 ### Style Overrides

 The `styles` prop lets you override classes on individual sub-elements. Use Tailwind's `!` modifier to ensure specificity if needed.

 | Key | Element | Selector |
 |---|---|---|
 | `title` | The heading text | `[data-sileo-title]` |
 | `description` | The body/description area | `[data-sileo-description]` |
 | `badge` | The icon badge circle | `[data-sileo-badge]` |
 | `button` | The action button | `[data-sileo-button]` |

 ```ts
 sileo.success({
   title: 'Custom styled',
   styles: {
     title: 'text-lg font-bold',
     description: 'italic'
   }
 });
 ```

 ## Performance Notes

 ### Roundness

 Control the border radius with the `roundness` prop (default `16`). Set it lower for sharper corners or higher for a rounder pill shape.

 > **Note:** Higher `roundness` values increase the SVG blur radius used for the gooey morph effect, which is more expensive to render. The recommended value is `16` for a good balance between aesthetics and performance.

 ## Autopilot

 By default, toasts auto-expand after a short delay and collapse before dismissing. Control this with the `autopilot` prop.

 - `autopilot: false` — disables auto expand/collapse entirely (hover to expand).
 - `autopilot: { expand: ms, collapse: ms }` — custom timing for each phase.

 ## Global Defaults

 Use the Toaster's `options` prop to set defaults for every toast. This is useful for applying a consistent dark theme across your app.

 ```svelte
 <Toaster
   position="top-right"
   options={{
     fill: "#171717",
     roundness: 16,
     styles: {
       title: "text-white!",
       description: "text-white/75!",
       badge: "bg-white/10!",
       button: "bg-white/10! hover:bg-white/15!",
     },
   }}
 />
 ```

 ## CSS Variables

 Sileo exposes CSS custom properties you can override globally to change state colors, dimensions, or animation timing.

 ```css
 :root {
   /* State colors (oklch) */
   --sileo-state-success: oklch(0.723 0.219 142.136);
   --sileo-state-loading: oklch(0.556 0 0);
   --sileo-state-error: oklch(0.637 0.237 25.331);
   --sileo-state-warning: oklch(0.795 0.184 86.047);
   --sileo-state-info: oklch(0.685 0.169 237.323);
   --sileo-state-action: oklch(0.623 0.214 259.815);
 
   /* Dimensions */
   --sileo-width: 350px;
   --sileo-height: 40px;
 
   /* Animation */
   --sileo-duration: 600ms;
 }
 ```

 ## Positions

```svelte
<!-- Available: top-left · top-center · top-right · bottom-left · bottom-center · bottom-right -->
<Toaster position="bottom-center" />
```

## License

[![LICENSE - MIT](https://img.shields.io/badge/LICENSE-MIT-111111?style=for-the-badge&labelColor=111111&logo=open-source-initiative&logoColor=white)](LICENSE)