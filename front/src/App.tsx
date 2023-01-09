import { Container } from "@mui/material";
import React from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/hocs/PrivateRoute";
import SideMenu from "./components/SideMenu";
import CheckControlDetail from "./pages/admin/check-control/detail/CheckControlDetail";
import CheckControlList from "./pages/admin/check-control/list/CheckControlList";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import CheckDeposit from "./pages/check/deposit/CheckDeposit";
import CheckList from "./pages/check/list/CheckList";
import Dashboard from "./pages/dashboard/Dashboard";
import AddPurchase from "./pages/purchase/add/AddPurchase";
import PurchaseList from "./pages/purchase/list/PurchaseList";

const App = () => {
  return (
    <Router>
      <ToastContainer />

      <SideMenu />

      <Container maxWidth="xs">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<ProtectedRoute />}>
            <Route path="" element={<Dashboard />} />
            <Route path="checks" element={<CheckList />} />
            <Route path="checks/deposit" element={<CheckDeposit />} />
            <Route path="purchases" element={<PurchaseList />} />
            <Route path="purchases/add" element={<AddPurchase />} />
          </Route>

          <Route
            path="/admin"
            element={<ProtectedRoute permission="check:list-all" />}
          >
            <Route path="checks" element={<CheckControlList />} />
            <Route path="checks/:id" element={<CheckControlDetail />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
