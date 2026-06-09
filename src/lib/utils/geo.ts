export const LUANDA_CENTER = { lat: -8.838, lng: 13.234 }

export function toPercent(lng: number, lat: number): { x: number; y: number } {
  const x = Math.max(5, Math.min(90, ((lng - 13.18) / 0.08) * 100))
  const y = Math.max(5, Math.min(88, ((lat - (-8.92)) / 0.1) * 100))
  return { x, y }
}
