import * as S from "./styled"

type Props = {
  icon: JSX.Element
  title?: string
  description: string | string[]
  small?: boolean
}

const BlockInfo = ({ icon, title, description, small }: Props) => {
  return (
    <S.Component>
      <S.IconArea>{icon}</S.IconArea>
      <S.Info>
        {!small && <S.Title>{title}</S.Title>}
        <S.Description>
          {Array.isArray(description) ? (
            description.map((l, k) => <S.DLine key={k}>{l}</S.DLine>)
          ) : (
            <S.DLine>{description}</S.DLine>
          )}
        </S.Description>
      </S.Info>
    </S.Component>
  )
}

export default BlockInfo
