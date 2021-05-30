import {FormioComponent} from "@tsed/formio";

export function getOAuthComponents(basePath: any): FormioComponent[] {
  return [
    {
      input: true,
      tree: true,
      components: [
        {
          input: true,
          inputType: "text",
          label: "Claim",
          key: "claim",
          multiple: false,
          placeholder: "Leave empty for everyone",
          defaultValue: "",
          protected: false,
          unique: false,
          persistent: true,
          hidden: false,
          clearOnHide: true,
          type: "textfield"
        },
        {
          input: true,
          tableView: true,
          label: "Field",
          key: "field",
          placeholder: "",
          dataSrc: "url",
          data: {
            url: `${basePath}/{{data.settings.resource}}`
          },
          valueProperty: "key",
          defaultValue: "",
          refreshOn: "resource",
          filter: "",
          template: "<span>{{ item.label || item.key }}</span>",
          multiple: false,
          protected: false,
          lazyLoad: false,
          unique: false,
          selectValues: "components",
          persistent: true,
          hidden: false,
          clearOnHide: true,
          validate: {
            required: true
          },
          type: "select"
        }
      ],
      tableView: true,
      label: "Map Claims",
      key: "openid-claims",
      protected: false,
      persistent: true,
      hidden: false,
      clearOnHide: true,
      type: "datagrid",
      customConditional: "show = ['openid'].indexOf(data.settings.provider) !== -1;"
    }
  ];
}
