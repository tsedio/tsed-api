import {FormioComponent} from "@tsed/formio";

export function getDropboxComponents(basePath: string): FormioComponent[] {
  return [
    {
      type: "select",
      input: true,
      label: "Autofill Email Field",
      key: "autofill-dropbox-email",
      placeholder: "Select which field to autofill with Dropbox account Email",
      template: "<span>{{ item.label || item.key }}</span>",
      dataSrc: "url",
      data: {
        url: `${basePath}/{{data.settings.resource}}/components`
      },
      valueProperty: "key",
      multiple: false,
      customConditional: "show = ['dropbox'].indexOf(data.settings.provider) !== -1;"
    },
    {
      type: "select",
      input: true,
      label: "Autofill First Name Field",
      key: "autofill-dropbox-given_name",
      placeholder: "Select which field to autofill with Dropbox account First Name",
      template: "<span>{{ item.label || item.key }}</span>",
      dataSrc: "url",
      data: {
        url: `${basePath}/{{data.settings.resource}}/components`
      },
      valueProperty: "key",
      multiple: false,
      customConditional: "show = ['dropbox'].indexOf(data.settings.provider) !== -1;"
    },
    {
      type: "select",
      input: true,
      label: "Autofill Last Name Field",
      key: "autofill-dropbox-familiar_name",
      placeholder: "Select which field to autofill with Dropbox account Last Name",
      template: "<span>{{ item.label || item.key }}</span>",
      dataSrc: "url",
      data: {
        url: `${basePath}/{{data.settings.resource}}/components`
      },
      valueProperty: "key",
      multiple: false,
      customConditional: "show = ['dropbox'].indexOf(data.settings.provider) !== -1;"
    },
    {
      type: "select",
      input: true,
      label: "Autofill Display Name Field",
      key: "autofill-dropbox-display_name",
      placeholder: "Select which field to autofill with Dropbox account Display Name",
      template: "<span>{{ item.label || item.key }}</span>",
      dataSrc: "url",
      data: {
        url: `${basePath}/{{data.settings.resource}}/components`
      },
      valueProperty: "key",
      multiple: false,
      customConditional: "show = ['dropbox'].indexOf(data.settings.provider) !== -1;"
    }
  ];
}
