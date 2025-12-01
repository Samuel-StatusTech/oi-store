/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"

import * as jwt from "jwt-decode"

// Pages
import EventSelect from "../pages/EventSelect"
import Home from "../pages/Home"
import Login from "../pages/Login"
import MyTickets from "../pages/MyTickets"
import Payment from "../pages/Payment"
import PaymentPix from "../pages/PaymentPix"
import { useEffect } from "react"
import getStore from "../store"

const Router = () => {
  const { event, user } = getStore()

  const checkTokenTime = async () => {
    if (user) {
      try {
        const token = localStorage.getItem("token")

        if (token) {
          const decoded = jwt.jwtDecode(token)

          if (decoded.exp) {
            const limit = decoded.exp * 1000
            const nowTime = new Date().getTime()
            if (nowTime > limit) {
              localStorage.removeItem("token")
            }
          } else localStorage.removeItem("token")
        }
      } catch (error) {}
    }
  }

  useEffect(() => {
    checkTokenTime()
  }, [])

  useEffect(() => {
    window.document.title = event ? event.corporateName : "ListaPix"
  }, [event])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route path="" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="eventSelect" element={<EventSelect />} />
          <Route path="mytickets">
            <Route path="" element={<MyTickets />} />
          </Route>
          <Route path="payment">
            <Route path="" element={<Payment />} />
            <Route path="pix" element={<PaymentPix />} />
          </Route>
          <Route path="*" element={<Navigate to={"/"} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router
