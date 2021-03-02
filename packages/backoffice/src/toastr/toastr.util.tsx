import { BxIcon } from "@tsed/shared";
import React, { PropsWithChildren } from "react";
import {
  toast,
  ToastContainer as TC,
  ToastContent,
  ToastOptions
} from "react-toastify";

function ToastrBody({
  title,
  children,
  icon,
  iconClass,
  color = "gray"
}: PropsWithChildren<any>) {
  return (
    <div className={"flex"}>
      <div className={"pr-3"}>
        <BxIcon name={icon} className={`text-lg ${iconClass}`} />
      </div>
      <div className={"text-sm"}>
        <div className={`text-${color}-700 font-bold pb-1`}>{title}</div>
        <div className={`text-gray-500`}>{children}</div>
      </div>
    </div>
  );
}

export function ToastContainer() {
  return (
    <TC
      autoClose={5000}
      containerId='toastr'
      draggablePercent={60}
      position={"bottom-right"}
      closeButton={() => (
        <BxIcon name={"x"} className={"hover:text-gray-900 text-lg"} />
      )}
    />
  );
}
export interface ToastrOptions extends ToastOptions {
  icon?: string;
}
export const toastr = {
  success(title: string, children: ToastContent, options: ToastrOptions = {}) {
    toast(
      <ToastrBody
        title={title}
        icon={options.icon || "comment-check"}
        iconClass={"text-green-500"}
      >
        {children}
      </ToastrBody>,
      { ...options, className: "success" }
    );
  },
  info(title: string, children: ToastContent, options: ToastrOptions = {}) {
    toast(
      <ToastrBody
        title={title}
        icon={options.icon || "info-circle"}
        iconClass={"text-primary-500"}
      >
        {children}
      </ToastrBody>,
      { ...options, className: "info" }
    );
  },

  warning(title: string, children: ToastContent, options: ToastrOptions = {}) {
    toast(
      <ToastrBody
        title={title}
        icon={options.icon || "message-error"}
        iconClass={"text-yellow-500"}
      >
        {children}
      </ToastrBody>,
      { ...options, className: "warning" }
    );
  },
  error(title: string, children: ToastContent, options: ToastrOptions = {}) {
    toast(
      <ToastrBody
        title={title}
        color={"red"}
        icon={options.icon || "error"}
        iconClass={"text-red-500"}
      >
        {children}
      </ToastrBody>,
      { ...options, className: "danger" }
    );
  }
};
