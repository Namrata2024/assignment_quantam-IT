import React, { Component, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserHome({ userData }) {
  const navigate = useNavigate();
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./sign-in";
  };
  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <div>
          Name<h1>{userData.fname}</h1>
          Email <h1>{userData.email}</h1>
          <br />
          <button onClick={logOut} className="btn btn-primary">
            Log Out
          </button>
          <button onClick={() =>  navigate('/adminDetails') }className="btn btn-primary">
          dashboard
          </button>
        </div>
      </div>
    </div>
  );
}