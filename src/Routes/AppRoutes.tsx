import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Loader } from "../assets/Images/image";
import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import PreviewProtectedRoute from "../features/auth/components/PreviewProtectedRoute";

const Home = lazy(() => import("../Pages/Home"));
const Login = lazy(() => import("../Pages/Login"));
const Register = lazy(() => import("../Pages/Register"));
const Dashboard = lazy(() => import("../Pages/Admin/Dashboard"));
const X3Staking = lazy(() => import("../Pages/Admin/X3Staking"));
const AutoCompounding = lazy(() => import("../Pages/Admin/AutoCompounding"));
const Profile = lazy(() => import("../Pages/Admin/Profile"));
const Mytree = lazy(() => import("../Pages/Admin/Mytree"));
const Directs = lazy(() => import("../Pages/Admin/Directs"));
const Downlines = lazy(() => import("../Pages/Admin/Downlines"));
const X2Deposit = lazy(() => import("../Pages/Admin/X2Deposit"));
const X3Deposit = lazy(() => import("../Pages/Admin/X3Deposit"));
const X2DepositHistory = lazy(() => import("../Pages/Admin/X2DepositHistory"));
const X3DepositHistory = lazy(() => import("../Pages/Admin/X3DepositHistory"));
const HoldingHistory = lazy(() => import("../Pages/Admin/HoldingHistory"));
const UpgradeActivations = lazy(() => import("../Pages/Admin/UpgradeActivations"));
const X3StakingHistory = lazy(() => import("../Pages/Admin/X3StakingHistory"));
const X3CompoundingHistory = lazy(() => import("../Pages/Admin/X3CompoundingHistory"));
const X2DirectIncome = lazy(() => import("../Pages/Admin/X2DirectIncome"));
const HybridLevelIncome = lazy(() => import("../Pages/Admin/HybridLevelIncome"));
const TRCSpecialIncome = lazy(() => import("../Pages/Admin/TRCSpecialIncome"));
const RoyaltyIncome = lazy(() => import("../Pages/Admin/RoyaltyIncome"));
const RewardIncome = lazy(() => import("../Pages/Admin/RewardIncome"));
const X2IncomeLedger = lazy(() => import("../Pages/Admin/X2IncomeLedger"));
const BiMonthly = lazy(() => import("../Pages/Admin/BiMonthly"));
const X3DirectIncome = lazy(() => import("../Pages/Admin/X3DirectIncome"));
const X3HybridLevelIncome = lazy(() => import("../Pages/Admin/X3HybridLevelIncome"));
const X3IncomeLedger = lazy(() => import("../Pages/Admin/X3IncomeLedger"));
const BonanzaBusiness = lazy(() => import("../Pages/Admin/BonanzaBusiness"));

const AppRoutes = () => {
  return (
    <div className="wrapper">
      <div className="content">
        <Suspense
          fallback={
            <div className="loader-box">
              <img src={Loader} alt="Loader" />
            </div>
          }
        >
          <Routes>
            <Route element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="sign-in" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="sign-up" element={<Register />} />
            </Route>
            <Route  element={<DashboardLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route
                path="x3-staking"
                element={
                  <PreviewProtectedRoute>
                    <X3Staking />
                  </PreviewProtectedRoute>
                }
              />
              <Route
                path="auto-compounding"
                element={
                  <PreviewProtectedRoute>
                    <AutoCompounding />
                  </PreviewProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <PreviewProtectedRoute>
                    <Profile />
                  </PreviewProtectedRoute>
                }
              />
              <Route path="mytree" element={<Mytree />} />
              <Route path="directs" element={<Directs />} />
              <Route path="downlines" element={<Downlines />} />
              <Route
                path="x2-deposit"
                element={
                  <PreviewProtectedRoute>
                    <X2Deposit />
                  </PreviewProtectedRoute>
                }
              />
              <Route
                path="x2-deposit-history"
                element={
                  <PreviewProtectedRoute>
                    <X2DepositHistory />
                  </PreviewProtectedRoute>
                }
              />
              <Route
                path="holding-history"
                element={
                  <PreviewProtectedRoute>
                    <HoldingHistory />
                  </PreviewProtectedRoute>
                }
              />
              <Route
                path="activate-upgrade-history"
                element={
                  <PreviewProtectedRoute>
                    <UpgradeActivations />
                  </PreviewProtectedRoute>
                }
              />
              <Route
                path="x3-deposit"
                element={
                  <PreviewProtectedRoute>
                    <X3Deposit />
                  </PreviewProtectedRoute>
                }
              />
              <Route
                path="x3-deposit-history"
                element={
                  <PreviewProtectedRoute>
                    <X3DepositHistory />
                  </PreviewProtectedRoute>
                }
              />
              <Route
                path="x3-staking-history"
                element={
                  <PreviewProtectedRoute>
                    <X3StakingHistory />
                  </PreviewProtectedRoute>
                }
              />
              <Route
                path="auto-compounding-history"
                element={
                  <PreviewProtectedRoute>
                    <X3CompoundingHistory />
                  </PreviewProtectedRoute>
                }
              />
              <Route path="income-x2">
                <Route path="direct-income" element={<X2DirectIncome />} />
                <Route path="hybrid-level-income" element={<HybridLevelIncome />} />
                <Route path="trc-special-income" element={<TRCSpecialIncome />} />
                <Route path="royalty-income" element={<RoyaltyIncome />} />
                <Route path="reward-income" element={<RewardIncome />} />
                <Route path="income-ledger" element={<X2IncomeLedger />} />
              </Route>
              <Route path="mpr-income" element={<BiMonthly />} />
              <Route path="x3-hybrid-level-income" element={<X3HybridLevelIncome />} />
              <Route path="x3-income-ledger" element={<X3IncomeLedger />} />
              <Route path="bonanza-business" element={<BonanzaBusiness />} />
              <Route path="income-x3">
                <Route path="x3-direct-income" element={<X3DirectIncome />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

export default AppRoutes;
