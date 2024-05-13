import * as S from "./styled"

type Props = {
  icon: string
  name: string
  phone: string
  description: string | string[]
}

const Organizer = (organizer: Props) => {
  return (
    <S.Component>
      <S.Image src={organizer.icon} alt={""} />
      <S.Title>{organizer.name}</S.Title>
      {Array.isArray(organizer.description) ? (
        organizer.description.map((desc, k) => (
          <S.Description key={k}>{desc}</S.Description>
        ))
      ) : (
        <S.Description>{organizer.description}</S.Description>
      )}
    </S.Component>
  )
}

export default Organizer
