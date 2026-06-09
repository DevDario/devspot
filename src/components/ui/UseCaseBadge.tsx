import type { UseCase } from '@/types'

export function UseCaseBadge({ useCase }: { useCase: UseCase }) {
  return (
    <span className="ds-tag use">{useCase}</span>
  )
}
