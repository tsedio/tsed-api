import { AuthState } from "@tsed/react-formio";
import React, { PropsWithChildren } from "react";
import { Redirect, Route, RouteProps } from "react-router";
import { isAuthorized } from "./auth.utils";

// import { isAuthorized } from "./auth.utils";

export interface ProtectedRouteProps extends RouteProps {
  auth: AuthState;
  roles: string[];
}

export const ProtectedRoute = ({
  auth,
  roles = [],
  children,
  ...rest
}: PropsWithChildren<ProtectedRouteProps>) => {
  return (
    <Route {...rest}>
      {() => {
        if (auth.isActive) {
          return null;
        }

        if (!isAuthorized(auth, roles)) {
          return <Redirect to='/auth' />;
        }

        return children;
      }}
    </Route>
  );
};
