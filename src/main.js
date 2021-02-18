import SvelteCodemirror from "./SvelteCodemirror.svelte";

const app = new SvelteCodemirror({
  target: document.body,
  props: {
  }
});

globalThis.appCodeMirror = app;

export default globalThis.appCodeMirror;

