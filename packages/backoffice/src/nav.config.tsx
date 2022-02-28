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
      },
      {
        title: "API",
        description: "Swagger documentation",
        icon: "code-alt",
        href: "/api",
        ctaLabel: "Go to API"
      }
    ]
  },
  {
    title: "Administration",
    roles: ["administrator"],
    items: [
      {
        title: "Accounts",
        description: "Manage all user accounts and his roles.",
        href: getFormioBasePath("resources", "user", "submissions"),
        icon: "user",
        ctaLabel: "Manage users",
        roles: ["administrator"]
      },
      {
        title: "Roles",
        description: "Manage all roles.",
        href: "/roles",
        icon: "group",
        ctaLabel: "Manage users",
        roles: ["administrator"]
      },
      {
        title: "Import/Export",
        description: "Export or import database",
        href: "/backup",
        icon: "data",
        ctaLabel: "Go to backup tools",
        roles: ["administrator"],
        items: [
          {
            title: "Import",
            description: "Import forms/resources/submissions from a json file",
            icon: "upload",
            roles: ["administrator"],
            ctaLabel: "Go to import tool"
          },
          {
            title: "Export",
            description: "Export forms/resources/submissions",
            icon: "download",
            roles: ["administrator"],
            ctaLabel: "Go to export tool"
          }
        ]
      },
      {
        title: "Settings",
        description: "Manage form.io settings",
        href: "/settings",
        icon: "cog",
        ctaLabel: "Go to settings",
        roles: ["administrator"],
        items: [
          {
            title: "Login form",
            description: "Edit user login form definition.",
            href: getFormioBasePath("forms", "user__login", "edit"),
            icon: "detail",
            ctaLabel: "Edit form",
            roles: ["administrator"]
          },
          {
            title: "Register form",
            description: "Edit registration form definition.",
            href: getFormioBasePath("forms", "user__register", "edit"),
            icon: "detail",
            ctaLabel: "Edit form",
            roles: ["administrator"]
          }
        ]
      }
    ]
  }
];
