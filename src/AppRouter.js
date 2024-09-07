import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

const AppRouter = () => {
  return (
    <GoogleOAuthProvider clientId="17706015383-g41mbf0klvaa36snjdfi705v3s3apkrf.apps.googleusercontent.com" >
      <Router>
        <App />
      </Router>
    </GoogleOAuthProvider>
  );
};

export default AppRouter;
