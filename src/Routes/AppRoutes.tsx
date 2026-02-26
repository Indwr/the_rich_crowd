import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Loader } from "../assets/Images/image";

const Home = lazy(() => import("../Pages/Home"));
const Login = lazy(() => import("../Pages/Login"));
const Register = lazy(() => import("../Pages/Register"));

const AppRoutes = () => {
  return (
    <div className="wrapper">
      <div className="content">
        <Suspense fallback={<div className="loader-box"><img src={Loader} alt="Loader" /></div>}>
          <Routes>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

export default AppRoutes;