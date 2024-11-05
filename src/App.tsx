import { ThemeProvider } from "styled-components"
import Routes from "./routes"
import { theme } from "./theme"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3"
import { ptBR } from "date-fns/locale/pt-BR"
import { useEffect } from "react"
import getStore from "./store"

function App() {
  const store = getStore()

  useEffect(() => {
    console.log(localStorage.getItem("shouldClearCache"))
    if (
      (store.event || store.user) &&
      localStorage.getItem("shouldClearCache") === "true"
    ) {
      localStorage.removeItem("token")
      store.controllers.event.clear()
      store.controllers.user.clear()
      localStorage.removeItem("shouldClearCache")

      // reload
      // eslint-disable-next-line no-self-assign
      // window.location.href = window.location.href
    }
  }, [store.controllers.event, store.controllers.user, store.event, store.user])

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        <Routes />
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App
