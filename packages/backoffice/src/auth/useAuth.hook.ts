import { AuthState, logout, selectRoot } from "@tsed/react-formio";
import { oneOfIsActive } from "@tsed/shared";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { replace } from "connected-react-router";
import { Config } from "../config";

export function useAuth() {
  const dispatch = useDispatch();
  const location = useLocation();
  const isActive = useSelector(oneOfIsActive("auth"));
  const auth = useSelector(selectRoot<AuthState>("auth"));

  const onLogout = useCallback(() => {
    dispatch(logout());
    setTimeout(() => dispatch(replace(Config.auth.login.path)), 1000);
  }, [dispatch]);

  const isAuth =
    location.pathname !== Config.auth.login.path && auth.user && auth.user.data;

  return { isActive, auth, isAuth, onLogout };
}
