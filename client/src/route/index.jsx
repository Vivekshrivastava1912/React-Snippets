import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import VerifyOtp from "../pages/VerifyOtp";
import ResetPassword from "../pages/ResetPassword";
import UserUpdate from "../pages/UserUpdate";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "register",
        element: <Register />
      },
      {
        path: "forgotpassword",
        element: <ForgotPassword />
      },
      {
        path: "verifyotp",
        element: <VerifyOtp />
      },
      {
        path: "resetpassword",
        element: <ResetPassword />
      },
      {
        path: "userdetailupdate",
        element: <UserUpdate />
      }
    ]
  }
]);

export default router;