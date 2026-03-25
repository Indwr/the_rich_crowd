import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Loader } from "../assets/Images/image";
import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import PreviewProtectedRoute from "../features/auth/components/PreviewProtectedRoute";
import DashboardSummary from "src/Pages/Admin/DashboardSummary";

const Home = lazy(() => import("../Pages/Home"));
const Login = lazy(() => import("../Pages/Login"));
const Register = lazy(() => import("../Pages/Register"));
const Dashboard = lazy(() => import("../Pages/Admin/Dashboard"));
const X3Staking = lazy(() => import("../Pages/Admin/X3Staking"));
const AutoCompounding = lazy(() => import("../Pages/Admin/AutoCompounding"));
const Profile = lazy(() => import("../Pages/Admin/Profile"));
const Mytree = lazy(() => import("../Pages/Admin/Mytree"));
const Directs = lazy(() => import("../Pages/Admin/Directs"));
const Generation = lazy(() => import("../Pages/Admin/Generation"));
const PlacementGeneration = lazy(() => import("../Pages/Admin/PlacementGeneration"));
const GenerationLevelDetails = lazy(() => import("../Pages/Admin/GenerationLevelDetails"));
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
const AutoCompoundingIncome = lazy(() => import("../Pages/Admin/AutoCompoundingIncome"));
const AutoCompoundingDirectIncome = lazy(() => import("../Pages/Admin/AutoCompoundingDirectIncome"));
const X3IncomeLedger = lazy(() => import("../Pages/Admin/X3IncomeLedger"));
const BonanzaBusiness = lazy(() => import("../Pages/Admin/BonanzaBusiness"));
const BonanzaBusinessMonthaly = lazy(() => import("../Pages/Admin/BonanzaBusinessMonthaly"));
const RoyaltyAchiver = lazy(() => import("../Pages/Admin/RoyaltyAchiver"));
const RoyaltyAchiverList = lazy(() => import("../Pages/Admin/RoyaltyAchiverList"));
const Notifications = lazy(() => import("../Pages/Admin/Notifications"));

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
              <Route
                path="dashboard-summary"
                element={
                    <DashboardSummary />
                }
              />
              <Route path="notifications" element={<Notifications />} />
              <Route path="mytree" element={<Mytree />} />
              <Route path="directs" element={<Directs />} />
              <Route path="generation" element={<Generation />} />
              <Route path="placement-generation" element={<PlacementGeneration />} />
              <Route path="generation/:level" element={<GenerationLevelDetails />} />
              <Route
                path="x2-deposit"
                element={
                    <X2Deposit />
                }
              />
              <Route
                path="x2-deposit-history"
                element={
                    <X2DepositHistory />
                }
              />
              <Route
                path="holding-history"
                element={
                    <HoldingHistory />
                }
              />
              <Route
                path="activate-upgrade-history"
                element={
                    <UpgradeActivations />
                }
              />
              <Route
                path="x3-deposit"
                element={
                    <X3Deposit />
                }
              />
              <Route
                path="x3-deposit-history"
                element={
                    <X3DepositHistory />
                }
              />
              <Route
                path="x3-staking-history"
                element={
                    <X3StakingHistory />
                }
              />
              <Route
                path="auto-compounding-history"
                element={
                    <X3CompoundingHistory />
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
              <Route
                path="auto-compounding-income/level-income"
                element={<AutoCompoundingIncome />}
              />
              <Route
                path="auto-compounding-income/direct-income"
                element={<AutoCompoundingDirectIncome />}
              />
              <Route path="x3-income-ledger" element={<X3IncomeLedger />} />
              <Route path="bonanza-business" element={<BonanzaBusiness />} />
              <Route path="bonanza-business-monthly" element={<BonanzaBusinessMonthaly />} />
              <Route path="royalty-achiver" element={<RoyaltyAchiver />} />
              <Route path="royalty-achiver">
                <Route path="royalty-achiver-list" element={<RoyaltyAchiverList />} />
              </Route>
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
