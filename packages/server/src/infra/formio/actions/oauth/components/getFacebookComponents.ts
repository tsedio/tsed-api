import {FormioComponent} from "@tsed/formio";

export function getFacebookComponents(basePath: string): FormioComponent[] {
  return [
    {
      type: "select",
      input: true,
      label: "Autofill Email Field",
      key: "autofill-facebook-email",
      placeholder: "Select which field to autofill with Facebook account Email",
      template: "<span>{{ item.label || item.key }}</span>",
      dataSrc: "url",
      data: {
        url: `${basePath}/{{data.settings.resource}}/components`
      },
      valueProperty: "key",
      multiple: false,
      customConditional: "show = ['facebook'].indexOf(data.settings.provider) !== -1;"
    },
    {
      type: "select",
      input: true,
      label: "Autofill Name Field",
      key: "autofill-facebook-name",
      placeholder: "Select which field to autofill with Facebook account Name",
      template: "<span>{{ item.label || item.key }}</span>",
      dataSrc: "url",
      data: {
        url: `${basePath}/{{data.settings.resource}}/components`
      },
      valueProperty: "key",
      multiple: false,
      customConditional: "show = ['facebook'].indexOf(data.settings.provider) !== -1;"
    },
    {
      type: "select",
      input: true,
      label: "Autofill First Name Field",
      key: "autofill-facebook-first_name",
      placeholder: "Select which field to autofill with Facebook account First Name",
      template: "<span>{{ item.label || item.key }}</span>",
      dataSrc: "url",
      data: {
        url: `${basePath}/{{data.settings.resource}}/components`
      },
      valueProperty: "key",
      multiple: false,
      customConditional: "show = ['facebook'].indexOf(data.settings.provider) !== -1;"
    },
    {
      type: "select",
      input: true,
      label: "Autofill Middle Name Field",
      key: "autofill-facebook-middle_name",
      placeholder: "Select which field to autofill with Facebook account Middle Name",
      template: "<span>{{ item.label || item.key }}</span>",
      dataSrc: "url",
      data: {
        url: `${basePath}/{{data.settings.resource}}/components`
      },
      valueProperty: "key",
      multiple: false,
      customConditional: "show = ['facebook'].indexOf(data.settings.provider) !== -1;"
    },
    {
      type: "select",
      input: true,
      label: "Autofill Last Name Field",
      key: "autofill-facebook-last_name",
      placeholder: "Select which field to autofill with Facebook account Last Name",
      template: "<span>{{ item.label || item.key }}</span>",
      dataSrc: "url",
      data: {
        url: `${basePath}/{{data.settings.resource}}/components`
      },
      valueProperty: "key",
      multiple: false,
      customConditional: "show = ['facebook'].indexOf(data.settings.provider) !== -1;"
    }
  ];
}
