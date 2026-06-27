export async function loadWasm() {
  const res = await fetch("/wasm/sync.wasm");
  const buffer = await res.arrayBuffer();

  const wasm = await WebAssembly.instantiate(buffer);

  return wasm.instance.exports;
}
