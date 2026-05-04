import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import VerifyOtp from "../pages/VerifyOtp";
import ResetPassword from "../pages/ResetPassword";
import UserUpdate from "../pages/UserUpdate";
import AddUserComponent from "../component/AddUserComponent";
import Componentpage from "../pages/Componentpage";
import EditComponent from "../pages/EditComponent";
import AicomponentGen from "../pages/AicomponentGen";

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
      },
      {
        path : "addsnippet",
        element : <AddUserComponent/>
      },
      {
        path: "components",
        element: <Componentpage />
      },
      {
        path: "edit-component",
        element: <EditComponent />
      },
      {
        path: "aicomponent-gen",
        element: <AicomponentGen/>
      }
    ]
  }
]);

export default router;