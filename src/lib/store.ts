import { get, writable } from "svelte/store";
import {
  AUTO_COLLAPSE_DELAY,
  AUTO_EXPAND_DELAY,
  DEFAULT_TOAST_DURATION,
  EXIT_DURATION,
} from "./constants";
import type { SileoOptions, SileoPosition, SileoState } from "./types";

interface InternalSileoOptions extends SileoOptions {
  id?: string;
  state?: SileoState;
}

export interface SileoItem extends InternalSileoOptions {
  id: string;
  instanceId: string;
  exiting?: boolean;
  autoExpandDelayMs?: number;
  autoCollapseDelayMs?: number;
  _explicitPosition?: boolean;
  slideFrom?: "left" | "right" | "up" | "down";
}

export const toastStore = writable<SileoItem[]>([]);

let storePosition: SileoPosition = "top-right";
let storeOptions: Partial<SileoOptions> | undefined;
let storeMultiple = false;

const getSlideDirection = (
  from: SileoPosition,
  to: SileoPosition,
): "left" | "right" | "up" | "down" | undefined => {
  const fromH = from.endsWith("left")
    ? "left"
    : from.endsWith("right")
      ? "right"
      : "center";
  const toH = to.endsWith("left")
    ? "left"
    : to.endsWith("right")
      ? "right"
      : "center";
  const fromV = from.startsWith("top") ? "top" : "bottom";
  const toV = to.startsWith("top") ? "top" : "bottom";

  if (fromH !== toH) {
    const order = { left: 0, center: 1, right: 2 };
    return order[fromH] < order[toH] ? "left" : "right";
  }
  if (fromV !== toV) {
    return fromV === "top" ? "up" : "down";
  }
  return undefined;
};

function setPosition(pos: SileoPosition) {
  const prev = storePosition;
  storePosition = pos;
  if (prev === pos) return;

  const slide = getSlideDirection(prev, pos);
  toastStore.update((items) =>
    items.map((t) =>
      t._explicitPosition ? t : { ...t, position: pos, slideFrom: slide },
    ),
  );
}

function setOptions(opts: Partial<SileoOptions> | undefined) {
  storeOptions = opts;
}

function setMultiple(enabled: boolean) {
  storeMultiple = enabled;
}

let idCounter = 0;
const generateId = () =>
  `${++idCounter}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const dismissToast = (id: string) => {
  const items = get(toastStore);
  const item = items.find((t) => t.id === id);
  if (!item || item.exiting) return;

  toastStore.update((prev) =>
    prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
  );

  setTimeout(
    () => toastStore.update((prev) => prev.filter((t) => t.id !== id)),
    EXIT_DURATION,
  );
};

const resolveAutopilot = (
  opts: InternalSileoOptions,
  duration: number | null,
): { expandDelayMs?: number; collapseDelayMs?: number } => {
  if (opts.autopilot === false || !duration || duration <= 0) return {};
  const cfg = typeof opts.autopilot === "object" ? opts.autopilot : undefined;
  const clamp = (v: number) => Math.min(duration, Math.max(0, v));
  return {
    expandDelayMs: clamp(cfg?.expand ?? AUTO_EXPAND_DELAY),
    collapseDelayMs: clamp(cfg?.collapse ?? AUTO_COLLAPSE_DELAY),
  };
};

const mergeOptions = (options: InternalSileoOptions) => ({
  ...storeOptions,
  ...options,
  styles: { ...storeOptions?.styles, ...options.styles },
});

const buildSileoItem = (
  merged: InternalSileoOptions,
  id: string,
  fallbackPosition?: SileoPosition,
): SileoItem => {
  const duration = merged.duration ?? DEFAULT_TOAST_DURATION;
  const auto = resolveAutopilot(merged, duration);
  const hasExplicit = merged.position !== undefined;
  return {
    ...merged,
    id,
    instanceId: generateId(),
    position: merged.position ?? fallbackPosition ?? storePosition,
    _explicitPosition: hasExplicit || undefined,
    autoExpandDelayMs: auto.expandDelayMs,
    autoCollapseDelayMs: auto.collapseDelayMs,
  };
};

const createToast = (options: InternalSileoOptions) => {
  const items = get(toastStore);
  const live = items.filter((t) => !t.exiting);
  const merged = mergeOptions(options);

  const id = merged.id ?? (storeMultiple ? generateId() : "sileo-default");
  const prev = live.find((t) => t.id === id);
  const item = buildSileoItem(merged, id, prev?.position);

  if (!storeMultiple) {
    toastStore.set([item]);
  } else if (prev) {
    toastStore.update((p) => p.map((t) => (t.id === id ? item : t)));
  } else {
    toastStore.update((p) => [...p.filter((t) => t.id !== id), item]);
  }
  return { id, duration: merged.duration ?? DEFAULT_TOAST_DURATION };
};

const updateToast = (id: string, options: InternalSileoOptions) => {
  const items = get(toastStore);
  const existing = items.find((t) => t.id === id);
  if (!existing) return;

  const item = buildSileoItem(mergeOptions(options), id, existing.position);
  toastStore.update((prev) => prev.map((t) => (t.id === id ? item : t)));
};

export interface SileoPromiseOptions<T = unknown> {
  loading: Pick<SileoOptions, "title" | "icon">;
  success: SileoOptions | ((data: T) => SileoOptions);
  error: SileoOptions | ((err: unknown) => SileoOptions);
  action?: SileoOptions | ((data: T) => SileoOptions);
  position?: SileoPosition;
}

export const sileo = {
  show: (opts: SileoOptions) => createToast({ ...opts, icon: opts.icon ?? null }).id,
  success: (opts: SileoOptions) =>
    createToast({ ...opts, state: "success" }).id,
  error: (opts: SileoOptions) => createToast({ ...opts, state: "error" }).id,
  warning: (opts: SileoOptions) =>
    createToast({ ...opts, state: "warning" }).id,
  info: (opts: SileoOptions) => createToast({ ...opts, state: "info" }).id,
  action: (opts: SileoOptions) => createToast({ ...opts, state: "action" }).id,
  loading: (opts: SileoOptions) =>
    createToast({ duration: null, ...opts, state: "loading" }).id,

  promise: <T>(
    promise: Promise<T> | (() => Promise<T>),
    opts: SileoPromiseOptions<T>,
  ): Promise<T> => {
    const { id } = createToast({
      ...opts.loading,
      state: "loading",
      duration: null,
      position: opts.position,
    });

    const p = typeof promise === "function" ? promise() : promise;

    p.then((data) => {
      if (opts.action) {
        const actionOpts =
          typeof opts.action === "function" ? opts.action(data) : opts.action;
        updateToast(id, { ...actionOpts, state: "action", id });
      } else {
        const successOpts =
          typeof opts.success === "function"
            ? opts.success(data)
            : opts.success;
        updateToast(id, { ...successOpts, state: "success", id });
      }
    }).catch((err) => {
      const errorOpts =
        typeof opts.error === "function" ? opts.error(err) : opts.error;
      updateToast(id, { ...errorOpts, state: "error", id });
    });

    return p;
  },

  dismiss: dismissToast,
  setPosition,
  setOptions,
  setMultiple,

  clear: (position?: SileoPosition) => {
    if (!position) {
      toastStore.set([]);
      return;
    }
    toastStore.update((prev) => prev.filter((t) => t.position !== position));
  },
};
