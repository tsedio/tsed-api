import {FormioComponent} from "@tsed/formio";

export function getGithubComponents(basePath: any): FormioComponent[] {
  return [
    {
      type: "select",
      input: true,
      label: "Autofill Email Field",
      key: "autofill-github-email",
      placeholder: "Select which field to autofill with GitHub account Email",
      template: "<span>{{ item.label || item.key }}</span>",
      dataSrc: "url",
      data: {
        url: `${basePath}/{{data.settings.resource}}/components`
      },
      valueProperty: "key",
      multiple: false,
      customConditional: "show = ['github'].indexOf(data.settings.provider) !== -1;"
    },
    {
      type: "select",
      input: true,
      label: "Autofill Username Field",
      key: "autofill-github-login",
      placeholder: "Select which field to autofill with GitHub account Username",
      template: "<span>{{ item.label || item.key }}</span>",
      dataSrc: "url",
      data: {
        url: `${basePath}/{{data.settings.resource}}/components`
      },
      valueProperty: "key",
      multiple: false,
      customConditional: "show = ['github'].indexOf(data.settings.provider) !== -1;"
    },
    {
      type: "select",
      input: true,
      label: "Autofill Name Field",
      key: "autofill-github-name",
      placeholder: "Select which field to autofill with GitHub account Name",
      template: "<span>{{ item.label || item.key }}</span>",
      dataSrc: "url",
      data: {
        url: `${basePath}/{{data.settings.resource}}/components`
      },
      valueProperty: "key",
      multiple: false,
      customConditional: "show = ['github'].indexOf(data.settings.provider) !== -1;"
    }
  ];
}
