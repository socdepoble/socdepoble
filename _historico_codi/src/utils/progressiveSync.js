export function processInChunks(items, fn) {
  const CHUNK = 50
  let i = 0

  function next(deadline) {
    while (i < items.length && deadline.timeRemaining() > 5) {
      fn(items[i])
      items[i] = null // alliberar RAM
      i++
    }

    if (i < items.length) {
      (window.requestIdleCallback || function(cb) { setTimeout(() => cb({ timeRemaining: () => 50 }), 1) })(next)
    }
  }

  (window.requestIdleCallback || function(cb) { setTimeout(() => cb({ timeRemaining: () => 50 }), 1) })(next)
}
