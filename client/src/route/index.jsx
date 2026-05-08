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
import Profile from "../pages/Profile";
import AdminAllUsers from "../pages/AdminAllUsers";
import AdminAllComponents from "../pages/AdminAllComponents";
import SvgGen from "../pages/SvgGen";
import SvgPage from "../pages/SvgPage";
import AdminAllSvgs from "../pages/AdminAllSvgs";
import ExploreSvgs from "../pages/ExploreSvgs";

import AuthGuard from "../component/AuthGuard";

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
        element: <AuthGuard><UserUpdate /></AuthGuard>
      },
      {
        path : "addsnippet",
        element : <AuthGuard><AddUserComponent/></AuthGuard>
      },
      {
        path: "components",
        element: <AuthGuard><Componentpage /></AuthGuard>
      },
      {
        path: "edit-component",
        element: <AuthGuard><EditComponent /></AuthGuard>
      },
      {
        path: "aicomponent-gen",
        element: <AuthGuard><AicomponentGen/></AuthGuard>
      },
      {
        path : "svgai-gen",
        element : <AuthGuard><SvgGen/></AuthGuard>
      },
      {
        path : "profile",
        element : <AuthGuard><Profile/></AuthGuard>
      },
      {
        path: "admin/all-users",
        element: <AuthGuard><AdminAllUsers /></AuthGuard>
      },
      {
        path: "admin/all-components",
        element: <AuthGuard><AdminAllComponents /></AuthGuard>
      },
      {
        path: "mysvgs",
        element: <AuthGuard><SvgPage /></AuthGuard>
      },
      {
        path: "explore-svgs",
        element: <ExploreSvgs />
      },
      {
        path: "admin/all-svgs",
        element: <AuthGuard><AdminAllSvgs /></AuthGuard>
      }

    ]
  }
]);

export default router;