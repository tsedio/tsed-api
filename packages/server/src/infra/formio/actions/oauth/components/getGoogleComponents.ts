import {FormioComponent} from "@tsed/formio";

export function getGoogleComponents(basePath: string): FormioComponent[] {
  return [
    {
      type: "select",
      input: true,
      label: "Autofill Email Field",
      key: "autofill-google-email",
      placeholder: "Select which field to autofill with Google account Email",
      template: "<span>{{ item.label || item.key }}</span>",
      dataSrc: "url",
      data: {
        url: `${basePath}/{{data.settings.resource}}/components`
      },
      valueProperty: "key",
      multiple: false,
      customConditional: "show = ['google'].indexOf(data.settings.provider) !== -1;"
    },
    {
      type: "select",
      input: true,
      label: "Autofill First Name Field",
      key: "autofill-google-given_name",
      placeholder: "Select which field to autofill with Google account First Name",
      template: "<span>{{ item.label || item.key }}</span>",
      dataSrc: "url",
      data: {
        url: `${basePath}/{{data.settings.resource}}/components`
      },
      valueProperty: "key",
      multiple: false,
      customConditional: "show = ['google'].indexOf(data.settings.provider) !== -1;"
    },
    {
      type: "select",
      input: true,
      label: "Autofill Last Name Field",
      key: "autofill-google-family_name",
      placeholder: "Select which field to autofill with Google account Last Name",
      template: "<span>{{ item.label || item.key }}</span>",
      dataSrc: "url",
      data: {
        url: `${basePath}/{{data.settings.resource}}/components`
      },
      valueProperty: "key",
      multiple: false,
      customConditional: "show = ['google'].indexOf(data.settings.provider) !== -1;"
    },
    {
      type: "select",
      input: true,
      label: "Autofill Display Name Field",
      key: "autofill-google-name",
      placeholder: "Select which field to autofill with Google account Display Name",
      template: "<span>{{ item.label || item.key }}</span>",
      dataSrc: "url",
      data: {
        url: `${basePath}/{{data.settings.resource}}/components`
      },
      valueProperty: "key",
      multiple: false,
      customConditional: "show = ['google'].indexOf(data.settings.provider) !== -1;"
    }
  ];
}
