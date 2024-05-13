import * as S from "./styled"

type Props = {
  icon: JSX.Element
  title: string
  description: string | string[]
}

const BlockInfo = ({ icon, title, description }: Props) => {
  return (
    <S.Component>
      <S.IconArea>{icon}</S.IconArea>
      <S.Info>
        <S.Title>{title}</S.Title>
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
