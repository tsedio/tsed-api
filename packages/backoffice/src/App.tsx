import { IfSidebar, Loader, oneOfIsActive, useSidebar } from "@tsed/shared";
import React from "react";
import { useSelector } from "react-redux";
import { Route as DefaultRoute, Switch } from "react-router";
import { useAuth } from "./auth/useAuth.hook";
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
  const { isAuth, isActive, auth, onLogout } = useAuth();
  const nav = useNav();

  const { sidebarOpen, toggleSidebar } = useSidebar();
  const size = sidebarOpen ? "64" : "14";

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
