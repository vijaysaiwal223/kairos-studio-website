/**
 * Waits for everything the page will paint: fonts, the window load event,
 * every <img> (lazy ones are switched to eager so they start now rather than
 * on scroll), every video's first frame and every video poster.
 *
 * Progress is reported as a 0–1 share of those items. `timeout` caps the wait
 * so a stalled request on a bad connection cannot hold the page hostage.
 */
export function preloadPage({
  exclude,
  onProgress,
  timeout = 15000,
}: {
  /** Assets inside this element (the loader's own) are not waited on. */
  exclude?: Element | null;
  onProgress?: (share: number) => void;
  timeout?: number;
}): Promise<void> {
  const owned = (el: Element) => !exclude?.contains(el);
  const tasks: Promise<unknown>[] = [];

  tasks.push(document.fonts.ready);

  if (document.readyState !== "complete") {
    tasks.push(new Promise((resolve) => window.addEventListener("load", resolve, { once: true })));
  }

  for (const img of Array.from(document.images).filter(owned)) {
    if (img.loading === "lazy") img.loading = "eager";
    tasks.push(settle(img, "load", () => img.complete).then(() => img.decode?.().catch(() => {})));
  }

  for (const video of Array.from(document.querySelectorAll("video")).filter(owned)) {
    if (video.poster) tasks.push(loadImage(video.poster));
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) continue;
    // preload="metadata" stops before the first frame; upgrade and restart it.
    if (video.preload !== "auto") {
      video.preload = "auto";
      video.load();
    }
    tasks.push(settle(video, "loadeddata", () => video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA));
  }

  let done = 0;
  onProgress?.(0);
  const tracked = tasks.map((task) =>
    task.finally(() => onProgress?.(++done / tasks.length)),
  );

  return Promise.race([
    Promise.allSettled(tracked).then(() => undefined),
    new Promise<void>((resolve) => window.setTimeout(resolve, timeout)),
  ]);
}

/** Resolves on `event` or error, or at once if `isReady` already holds. */
function settle(el: HTMLElement, event: string, isReady: () => boolean) {
  return new Promise<void>((resolve) => {
    if (isReady()) return resolve();
    el.addEventListener(event, () => resolve(), { once: true });
    el.addEventListener("error", () => resolve(), { once: true });
  });
}

function loadImage(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = src;
  });
}
