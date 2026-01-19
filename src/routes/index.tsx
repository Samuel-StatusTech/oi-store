/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

// Pages
import EventSelect from "../pages/EventSelect"
import Home from "../pages/Home"
import Login from "../pages/Login"
import MyTickets from "../pages/MyTickets"
import Payment from "../pages/Payment"
import PaymentPix from "../pages/PaymentPix"
import NotFoundPage from "../pages/404"

import getStore from "../store"
import { Api } from "../api"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import loadingAnimation from "../assets/animations/loading"
import { TEventData } from "../utils/@types/data/event"

const Router = () => {
  const { event, controllers } = getStore()

  const [loading, setLoading] = useState(true)
  const alreadyCheckedRef = useRef(false)

  useEffect(() => {
    if (!window.location.href.includes("404")) {
      try {
        if (!alreadyCheckedRef.current) setLoading(true)

        Api.get.subdomainStatus({}).then((res) => {
          alreadyCheckedRef.current = true

          if (res.ok) setLoading(false)
          else window.location.href = "404"
        })
      } catch (error) {}
    } else {
      if (loading) setLoading(false)
    }
  }, [window.location.href])

  useEffect(() => {
    window.document.title = event ? event.corporateName : "ListaPix"
  }, [event])

  useEffect(() => {
    const sessionEvent = sessionStorage.getItem("event")

    if (sessionEvent !== null) {
      const parsedSessionEvent: TEventData = JSON.parse(sessionEvent)
      controllers.event.setData(parsedSessionEvent)
    }
  }, [])

  if (loading) {
    return (
      <div
        style={{
          width: "100svw",
          height: "100svh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <div style={{ width: 256 }}>
          <DotLottieReact
            data={loadingAnimation}
            loop
            autoplay
            width={"100%"}
          />
        </div>
      </div>
    )
  }

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
          <Route path="404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router
