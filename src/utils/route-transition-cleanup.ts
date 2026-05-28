type Cleanup = () => void

const cleanups = new Set<Cleanup>()

export const registerRouteTransitionCleanup = (cleanup: Cleanup) => {
  cleanups.add(cleanup)

  return () => {
    cleanups.delete(cleanup)
  }
}

export const runRouteTransitionCleanups = () => {
  const pendingCleanups = Array.from(cleanups)
  cleanups.clear()

  pendingCleanups.forEach((cleanup) => {
    cleanup()
  })
}
