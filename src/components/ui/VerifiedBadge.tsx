import { IconCircleCheck } from '@tabler/icons-react'

export function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] bg-[rgba(255,255,255,0.06)] text-[#888] border border-[#333] rounded-[3px] px-[5px] py-[1px]">
      <IconCircleCheck size={10} />
      verified
    </span>
  )
}
