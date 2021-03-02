import React from "react";

export interface IfProps extends Record<string, any> {
  if: any;
}

export function withOptionalIf(Component: React.ComponentType<any>) {
  return function IfWrapper({ if: show = true, ...props }: IfProps) {
    if (!show) {
      return null;
    }

    return <Component {...props} />;
  };
}

export function withIf(Component: React.ComponentType | any) {
  return function IfWrapper({ if: show, ...props }: IfProps) {
    if (!show) {
      return null;
    }

    return <Component {...props} />;
  };
}
