import { DefaultTheme } from "styled-components"

export const theme: DefaultTheme = {
  colors: {
    black: {
      secondary: "#2A2A2A",
    },
    blue: {
      main: "#0061E6",
      darker: "rgb(14, 23, 34)",
    },
    green: {
      main: "rgb(55, 133, 88)",
      light: "rgb(55, 195, 88)",
    },
    orange: {
      main: "orange",
    },
    white: {
      main: "#FAFAFA",
      secondary: "#E6E7EA",
    },
  },
  bp: {
    large: 1240,
    medium: 920,
    small: 520,
    xsmall: 320,
  },
  animations: {
    types: {
      fade: "animation: fade; animation-fill-mode: forwards;",
      fadeTop: "animation: fadeTop; animation-fill-mode: forwards;",
      fadeRight: "animation: fadeRight; animation-fill-mode: forwards;",
      fadeBottom: "animation: fadeBottom; animation-fill-mode: forwards;",
      fadeLeft: "animation: fadeLeft; animation-fill-mode: forwards;",
    },
    durations: {
      main: `animation-duration: 0.4s;`,
      slow: `animation-duration: 0.6s;`,
      fast: `animation-duration: 0.2s;`,
    },
    delays: {
      main: (x = 1) => `animation-delay: calc( ${x} * 0.2s);`,
      slow: (x = 1) => `animation-delay: calc( ${x} * 0.4s);`,
      slower: (x = 1) => `animation-delay: calc( ${x} * 0.6s);`,
    },
  },
}
