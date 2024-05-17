import { useCallback, useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"

type Props = {
  children?: JSX.Element | JSX.Element[]
}

const AuthRoute = ({ children }: Props) => {
  const [checkedLogin, setCheckedLogin] = useState(false)
  const [isLogged, setIsLogged] = useState(false)

  const checkLogin = useCallback(() => {
    const logged = Boolean(localStorage.getItem("logged"))
    setIsLogged(logged)
    setCheckedLogin(true)
  }, [])

  useEffect(() => {
    checkLogin()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return checkedLogin ? (
    isLogged ? (
      <Outlet />
    ) : (
      // children
      <Navigate
        to={"/login"}
        replace={true}
        state={{
          originalPath: document.location.href,
        }}
      />
    )
  ) : null
}

export default AuthRoute
