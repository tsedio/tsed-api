const resolve = (url: string) =>
  (url || "").replace("{origin}", window.location.origin);

const formioUrl = resolve(process.env.REACT_APP_FORMIO_URL);
const apiUrl = resolve(process.env.REACT_APP_API_URL);
const appUrl = resolve(process.env.REACT_APP_URL);

export function getFormioBasePath(...paths: string[]) {
  return ["/formio", ...paths].filter(Boolean).join("/");
}

export const Config = {
  projectTitle: "Ts.ED",
  projectIcon: "/tsed.svg",
  headerHeight: "64px",
  formioUrl,
  apiUrl,
  appUrl,

  forms: {
    path: getFormioBasePath(":formType")
  },
  form: {
    path: getFormioBasePath(":formType", ":formId")
  },
  auth: {
    dashboard: {
      path: "/"
    },
    login: {
      path: "/auth",
      form: "user/login"
    },
    register: {
      path: "/register",
      form: "user/register"
    },
    profile: {
      path: "/profile",
      form: "user",
      oauthLinksForm: "oAuthLink"
    }
  }
};
