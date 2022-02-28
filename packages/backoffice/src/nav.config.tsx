import { Config, getFormioBasePath } from "./config";
import { CreateFormButton } from "./formio/components/buttons/createFormButton.component";

export default [
  {
    title: "Home",
    sidebar: false,
    home: false,
    items: [
      {
        title: "Dashboard",
        icon: "home",
        href: "/"
      },
      {
        title: "Profile",
        icon: "user",
        href: Config.auth.profile.path
      }
    ]
  },
  {
    title: "Form.io",
    roles: ["administrator", "authenticated"],
    items: [
      {
        title: "Forms",
        description: "Manage all forms. Create or update forms.",
        icon: "detail",
        ctaLabel: "Go to forms",
        href: getFormioBasePath("forms"),
        formType: "forms",
        headerNav: CreateFormButton
      },
      {
        title: "Resources",
        description:
          "Manage all resources. Resources are consumed by components in a form like a dropdown/selectboxes/etc...",
        icon: "folder",
        ctaLabel: "Go to resources",
        href: getFormioBasePath("resources"),
        formType: "resources",
        operations: {
          edit: true,
          access: true,
          actions: true,
          submissions: true,
          exports: true,
          delete: true
        },
        headerNav: CreateFormButton
      }
    ]
  },
  {
    title: "Administration",
    roles: ["administrator"],
    items: [
      {
        title: "Manage users",
        description: "Manage all user accounts and his roles.",
        href: getFormioBasePath("resources", "user", "submissions"),
        icon: "user",
        ctaLabel: "Manage users",
        roles: ["administrator"]
      },
      {
        title: "Edit Login form",
        description: "Edit user login form definition.",
        href: getFormioBasePath("forms", "user__login", "edit"),
        icon: "detail",
        ctaLabel: "Edit form",
        roles: ["administrator"]
      },
      {
        title: "Edit Register form",
        description: "Edit registration form definition.",
        href: getFormioBasePath("forms", "user__register", "edit"),
        icon: "detail",
        ctaLabel: "Edit form",
        roles: ["administrator"]
      }
    ]
  }
];
