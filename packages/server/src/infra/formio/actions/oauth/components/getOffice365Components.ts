import {FormioComponent} from "@tsed/formio";

export function getOffice365Components(basePath: string): FormioComponent[] {
  return [
    {
      type: "select",
      input: true,
      label: "Autofill Email Field",
      key: "autofill-office365-Id",
      placeholder: "Select which field to autofill with Office 365 account Email",
      template: "<span>{{ item.label || item.key }}</span>",
      dataSrc: "url",
      data: {
        url: `${basePath}/{{data.settings.resource}}/components`
      },
      valueProperty: "key",
      multiple: false,
      customConditional: "show = ['office365'].indexOf(data.settings.provider) !== -1;"
    },
    {
      type: "select",
      input: true,
      label: "Autofill Display Name Field",
      key: "autofill-office365-DisplayName",
      placeholder: "Select which field to autofill with Office 365 account Display Name",
      template: "<span>{{ item.label || item.key }}</span>",
      dataSrc: "url",
      data: {
        url: `${basePath}/{{data.settings.resource}}/components`
      },
      valueProperty: "key",
      multiple: false,
      customConditional: "show = ['office365'].indexOf(data.settings.provider) !== -1;"
    }
  ];
}
