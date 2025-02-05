import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Login/login";
import Home from "./Pages/Home/Home";
import Users from "./Pages/Users/Users";
import UserDetails from "./Pages/UserDetails/UserDetails";
import Request from "./Pages/Request/Request";
import EditRequests from "./Pages/EditRequests/editRequests";
import Code from "./Pages/Code/Code";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:userId" element={<UserDetails />} />
        <Route path="/requests" element={<Request />} />
        <Route path="/editrequests" element={<EditRequests />} />
        <Route path="/codes" element={<Code />} />
      </Routes>
    </>
  );
}

export default App;
