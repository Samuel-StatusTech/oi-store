import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"

// Pages
import EventSelect from "../pages/EventSelect"
import Home from "../pages/Home"
import Login from "../pages/Login"
import MyTickets from "../pages/MyTickets"
import MyEventTickets from "../pages/MyEventTickets"
import Payment from "../pages/Payment"
import PaymentPix from "../pages/PaymentPix"
import AuthRoute from "./AuthRoute"

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route path="" element={<EventSelect />} />
          <Route path="login" element={<Login />} />
          <Route element={<AuthRoute />}>
            <Route path="event">
              <Route path=":eventId" element={<Home />} />
            </Route>
            <Route path="mytickets">
              <Route path="" element={<MyTickets />} />
              <Route path=":eventId" element={<MyEventTickets />} />
            </Route>
            <Route path="payment">
              <Route path="" element={<Payment />} />
              <Route path="pix" element={<PaymentPix />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to={"/"} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router
