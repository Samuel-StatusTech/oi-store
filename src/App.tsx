import { ThemeProvider } from "styled-components"
import Routes from "./routes"
import { theme } from "./theme"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3"
import { ptBR } from "date-fns/locale/pt-BR"

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        <Routes />
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App
