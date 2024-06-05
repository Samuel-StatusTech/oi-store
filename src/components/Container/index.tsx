import * as S from "./styled"

type Props = {
  children?: JSX.Element | JSX.Element[]
  fullHeight?: boolean
}

const Container = ({ children, fullHeight }: Props) => {
  return <S.Component $fullHeight={fullHeight}>{children}</S.Component>
}

export default Container
