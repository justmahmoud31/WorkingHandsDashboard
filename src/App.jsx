import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Login/login";
import Home from "./Pages/Home/Home";
import Users from "./Pages/Users/Users";
import UserDetails from "./Pages/UserDetails/UserDetails";
import Request from "./Pages/Request/Request";
import EditRequests from "./Pages/EditRequests/editRequests";
import Code from "./Pages/Code/Code";
import AddCode from "./Pages/Code/AddCode";
import ProtectedRoute from "./Components/ProtectedRoutes"; // Import ProtectedRoute
import Admin from "./Pages/Admin/Admin";
import Ads from "./Pages/Ads/Ads";
import AddAdmin from "./Pages/Admin/AddAdmin";
import AddAdd from "./Pages/Ads/AddAdd";
import EditAd from "./Pages/Ads/EditAd";

function App() {
  return (
    <>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:userId"
          element={
            <ProtectedRoute>
              <UserDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <Request />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admins"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addadmin"
          element={
            <ProtectedRoute>
              <AddAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editrequests"
          element={
            <ProtectedRoute>
              <EditRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/codes"
          element={
            <ProtectedRoute>
              <Code />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ads"
          element={
            <ProtectedRoute>
              <Ads />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addad"
          element={
            <ProtectedRoute>
              <AddAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editad/:id"
          element={
            <ProtectedRoute>
              <EditAd />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addcode"
          element={
            <ProtectedRoute>
              <AddCode />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
