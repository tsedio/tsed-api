import {FormioComponent} from "@tsed/formio";

export function getLinkedinComponents(basePath: string): FormioComponent[] {
  return [
    {
      type: "select",
      input: true,
      label: "Autofill First Name Field",
      key: "autofill-linkedin-firstName",
      placeholder: "Select which field to autofill with LinkedIn  account First Name",
      template: "<span>{{ item.label || item.key }}</span>",
      dataSrc: "url",
      data: {
        url: `${basePath}/{{data.settings.resource}}/components`
      },
      valueProperty: "key",
      multiple: false,
      customConditional: "show = ['linkedin'].indexOf(data.settings.provider) !== -1;"
    }
  ];
}
