interface PillProps {
  label: string
  active: boolean
  variant?: 'a' | 'g' | 's'
  onClick: () => void
}

export function Pill({ label, active, variant = 'a', onClick }: PillProps) {
  const cls = active
    ? variant === 'a'
      ? 'on-a'
      : variant === 'g'
        ? 'on-g'
        : 'on-s'
    : ''
  return (
    <button className={`ds-pill ${cls}`} onClick={onClick}>
      {label}
    </button>
  )
}
