import "./styled-components"

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      black: {
        secondary: string
      }
      blue: {
        darker: string
        main: string
      }
      green: {
        main: string
        light: string
      }
      orange: {
        main: string
      }
      white: {
        main: string
        secondary: string
      }
    }
    bp: {
      large: number
      medium: number
      small: number
      xsmall: number
    }
  }
}
