import React, { useEffect } from "react";
import { useOktaAuth } from "@okta/okta-react";
import { useDispatch } from "react-redux";
import { login, logout } from "./authSlice";

const Login = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (authState?.isAuthenticated) {
      oktaAuth.getUser().then((user) => dispatch(login(user)));
    } else {
      dispatch(logout());
    }
  }, [authState, oktaAuth, dispatch]);

  const handleLogin = () => oktaAuth.signInWithRedirect();
  const handleLogout = () => oktaAuth.signOut();

  if (authState?.isAuthenticated) {
    return <button onClick={handleLogout}>Logout</button>;
  }

  return <button onClick={handleLogin}>Login with Okta</button>;
};

export default Login;
