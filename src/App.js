import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AdminHome from "./components/adminHome";
import Login from "./components/LoginForm";
import SignUp from "./components/RegisterForm";
import UserDetails from "./components/userDetails";
// import ImageUpload from "./components/imageUpload.";

function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn");
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            exact
            path="/"
            element={isLoggedIn == "true" ? <UserDetails /> : <Login />}
          />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/userDetails" element={<UserDetails />} />
           <Route path="/adminDetails" element={<AdminHome />} />
        </Routes>
        {/* <ImageUpload/> */}
      </div>
    </Router>
  );
}

export default App;