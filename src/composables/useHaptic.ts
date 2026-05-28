export function useHaptic() {
  function lightTap() {
    try {
      navigator.vibrate?.(10)
    } catch { /* noop - vibration not supported */ }
  }

  function mediumTap() {
    try {
      navigator.vibrate?.(20)
    } catch { /* noop */ }
  }

  function heartBeat() {
    try {
      navigator.vibrate?.([30, 80, 30])
    } catch { /* noop */ }
  }

  return { lightTap, mediumTap, heartBeat }
}
