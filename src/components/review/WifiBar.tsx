const WIFI_COLOR = '#5bc8a0'

export function WifiBar({ level }: { level: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className="inline-block w-[6px] h-[6px] rounded-full"
          style={{ background: i <= level ? WIFI_COLOR : '#2a2a2a' }}
        />
      ))}
    </span>
  )
}
