import styled from "styled-components"

export const Component = styled.div<{ $k: number }>`
  display: flex;
  flex-direction: column;
  overflow: hidden;

  opacity: 0;
  ${({ $k, theme }) =>
    theme.animations.types.fadeLeft +
    theme.animations.durations.main +
    theme.animations.delays.main($k)}
`

export const Item = styled.div`
  display: flex;
  flex-direction: column;
`

export const GroupInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 16px;
`

export const GroupInfoMain = styled.div`
  flex: 1;
`

export const GroupName = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black.secondary};
`

export const GroupInfoSecondary = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
`

export const GroupBasePrice = styled.span`
  font-size: 16px;

  strong {
    font-weight: 600;
  }
`

export const ListWrapper = styled.div<{ $opened: boolean }>`
  display: grid;
  grid-template-rows: ${({ $opened }) => ($opened ? 1 : 0)}fr;
  overflow: hidden;
  transition: grid-template-rows 0.6s;
`

export const ListArea = styled.div`
  min-height: 0;
`

export const List = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 10px;
`
