import styled from "styled-components"

export const Page = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  height: 100vh;
`

export const FormArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 16px 4px rgba(0, 0, 0, 0.14);
  max-width: 360px;
  width: 100%;
`

export const FormTitle = styled.h1`
  text-align: center;
`

export const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const Label = styled.label`
  position: relative;
  max-width: 100%;

  span {
    position: absolute;
    left: 6px;
    top: 4px;
    font-size: 16px;
    transition: transform 0.3s, font-size 0.3s;
  }

  input:focus + span,
  input:not(:placeholder-shown) + span {
    transform: translateY(-24px);
    font-size: 14px;
  }
`

export const Input = styled.input`
  border: 1px solid #ccc;
  outline: none;
  padding: 6px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.black.secondary};
  border-radius: 4px;
  width: 100%;
  transition: border-color 0.3s;

  &:focus {
    border: 1px solid ${({ theme }) => theme.colors.blue.main};
  }
`

export const Button = styled.button`
  cursor: pointer;
  padding: 0.6rem 1.4rem;
  border-radius: 4px;
  padding: 0.6rem 2.2rem;
  width: fit-content;
  margin: auto;
  cursor: pointer;
  outline: none;
  border: none;
  background-color: ${({ theme }) => theme.colors.blue.main};
  box-shadow: 0 2px 4px -2px rgba(0, 0, 0, 0);
  opacity: 0.8;
  transition: opacity 0.3s, box-shadow 0.3s;
  color: #fff;

  &:hover {
    opacity: 1;
    box-shadow: 0 2px 4px -2px rgba(0, 0, 0, 0.24);
  }
`
