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
    const event = sessionStorage.getItem("event")
    const user = sessionStorage.getItem("user")

    if (user && !store.user) store.controllers.user.setData(JSON.parse(user))

    if (event) {
      if (!store.event) store.controllers.event.setData(JSON.parse(event))
    } else {
      if (
        !window.location.href.includes("eventSelect") &&
        !window.location.href.includes("404")
      ) {
        window.location.href = "/eventSelect"
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionStorage, store.user, store.event])

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        <Routes />
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App
