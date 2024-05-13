import "./styled-components"

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      blue: {
        darker: string
        main: string
      }
      green: {
        main: string
      }
      white: {
        main: string
        secondary: string
      }
      black: {
        secondary: string
      }
    }
  }
}
