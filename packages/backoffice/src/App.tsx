import { AuthState, logout, selectRoot } from "@tsed/react-formio";
import { IfSidebar, Loader, oneOfIsActive, useSidebar } from "@tsed/shared";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route as DefaultRoute, Switch } from "react-router";
import { Config } from "./config";
import { IfHeader } from "./header/header.component";
import { SiderbarHeader } from "./header/sidebarHeader.component";
import { useNav } from "./nav/useNav.hook";
import { routes } from "./routes";

function LoaderContainer() {
  const isActive = useSelector(oneOfIsActive("loader"));
  return <Loader isActive={isActive} />;
}

function App() {
  const { headerHeight } = Config;
  const dispatch = useDispatch();
  const isActive = useSelector(oneOfIsActive("auth"));
  const auth = useSelector(selectRoot<AuthState>("auth"));
  const nav = useNav();
  const onLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const { sidebarOpen, toggleSidebar } = useSidebar();
  const size = sidebarOpen ? "64" : "14";
  const isAuth = auth.user && auth.user.data;

  if (isActive) {
    return <Loader isActive={isActive} />;
  }

  return (
    <div className='App'>
      <IfHeader
        if={isAuth}
        auth={auth}
        title={"title"}
        height={headerHeight}
        onLogout={onLogout}
        {...nav}
        className={`left-${size}`}
      />

      <main className={`transition-all ${isAuth ? `ml-${size}` : ""}`}>
        <div className={"p-5"}>
          <Switch>
            {routes.map(
              (
                {
                  guard: Route = DefaultRoute,
                  component: View,
                  options,
                  ...routeProps
                },
                index
              ) => (
                <Route key={index} auth={auth} {...routeProps}>
                  <View
                    basePath={routeProps.path}
                    operations={nav?.page?.operations}
                    {...(options || {})}
                  />
                </Route>
              )
            )}
          </Switch>
        </div>
      </main>

      <IfSidebar
        if={isAuth}
        title={Config.projectTitle}
        header={SiderbarHeader}
        height={headerHeight}
        width={size}
        sidebarOpen={sidebarOpen}
        onToggle={toggleSidebar}
        items={nav.getNav("sidebar")}
        auth={auth}
      />

      <LoaderContainer />
    </div>
  );
}

export default App;
