import { X, AlertCircle, CheckCircle2 } from "lucide-react"

import * as S from "./styled"

type DialogVariant = "error" | "success" | "info"

interface DialogProps {
  open: boolean
  title: string
  description?: string
  variant?: DialogVariant
  onClose: () => void
  actionLabel?: string
  onAction?: () => void
}

export default function Dialog({
  open,
  title,
  description,
  variant = "info",
  onClose,
  actionLabel = "Entendi",
  onAction,
}: DialogProps) {
  if (!open) return null

  const Icon =
    variant === "error"
      ? AlertCircle
      : variant === "success"
        ? CheckCircle2
        : AlertCircle

  return (
    <S.Overlay>
      <S.Dialog>
        <S.CloseButton onClick={onClose}>
          <X size={18} />
        </S.CloseButton>

        <S.IconWrapper variant={variant}>
          <Icon size={28} />
        </S.IconWrapper>

        <S.Title>{title}</S.Title>

        {description && <S.Description>{description}</S.Description>}

        <S.Actions>
          <S.PrimaryButton
            onClick={() => {
              onAction?.()
              onClose()
            }}
          >
            {actionLabel}
          </S.PrimaryButton>
        </S.Actions>
      </S.Dialog>
    </S.Overlay>
  )
}
