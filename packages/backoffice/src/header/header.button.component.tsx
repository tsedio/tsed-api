import { withOptionalIf } from "@tsed/shared";
import React, { forwardRef, PropsWithChildren } from "react";

// eslint-disable-next-line react/display-name
export const HeaderButton = forwardRef(
  ({ onClick, children, paddingX = 4 }: PropsWithChildren<any>, ref: any) => {
    return (
      <span
        ref={ref}
        onClick={onClick}
        className={`reset-anchor cursor-pointer flex font-sans font-bold items-center px-${paddingX} relative focus:text-secondary hover:text-secondary transition-color uppercase text-gray-darker focus:text-gray-darker-active hover:text-gray-darker-active`}
      >
        {children}
      </span>
    );
  }
);

export const IfHeaderButton = withOptionalIf(HeaderButton);
