import type { NoiseLevel as NoiseLevelType } from '@/types'

const ICONS: Record<NoiseLevelType, string> = {
  quiet: '🤫',
  moderate: '🗣️',
  loud: '🔊',
}

export function NoiseLevel({ level }: { level: NoiseLevelType }) {
  return (
    <span className="text-[11px] text-[#888]">
      {ICONS[level]} {level}
    </span>
  )
}
