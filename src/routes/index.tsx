import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"

// Pages
import Home from "../pages/Home"
import Login from "../pages/Login"

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route path="" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<Navigate to={"/"} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router
