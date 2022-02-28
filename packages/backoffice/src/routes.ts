import { FormioContainer, FormioEventObj } from "@tsed/react-formio-container";
import { Loader } from "@tsed/shared";
import { Route, RouteComponentProps, RouteProps } from "react-router";
import { ApiViewSpec } from "./api/api.view";
import { AuthView } from "./auth/auth.view";
import { ProtectedRoute } from "./auth/protectedRoute.component";
import { BackupView } from "./backup/backup.view";
import { Config } from "./config";
import { HomeView } from "./home/home.view";
import { ProfileView } from "./profile/profile.view";
import { RegisterView } from "./register/register.view";
import { SettingsView } from "./settings/settings.view";
import { toastr } from "./toastr/toastr.util";

export interface RouteConfig extends RouteProps {
  guard?:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
  /**
   * options forwarded to the View (component)
   */
  options?: any;
}

export const routes: RouteConfig[] = [
  {
    path: Config.auth.dashboard.path,
    exact: true,
    guard: ProtectedRoute,
    component: HomeView
  },
  {
    path: Config.forms.path,
    guard: ProtectedRoute,
    component: FormioContainer,
    options: {
      LoaderComponent: Loader,
      onSuccess(eventObj: FormioEventObj) {
        toastr.success(eventObj.title, eventObj.message);
      },
      onError(eventObj: FormioEventObj) {
        toastr.error(eventObj.title, eventObj.message);
      }
    }
  },
  {
    path: Config.auth.login.path,
    exact: true,
    guard: Route,
    component: AuthView
  },
  {
    path: Config.auth.register.path,
    exact: true,
    guard: Route,
    component: RegisterView
  },
  {
    path: Config.auth.profile.path,
    exact: true,
    guard: ProtectedRoute,
    component: ProfileView
  },
  {
    path: "/api",
    guard: ProtectedRoute,
    component: ApiViewSpec
  },
  {
    path: "/backup",
    guard: ProtectedRoute,
    component: BackupView
  },
  {
    path: "/settings",
    guard: ProtectedRoute,
    component: SettingsView
  },
  {
    path: "*",
    guard: Route,
    component: AuthView
  }
];
