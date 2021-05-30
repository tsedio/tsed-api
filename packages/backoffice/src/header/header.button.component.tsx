import { withOptionalIf } from "@tsed/shared";
import React, { forwardRef, PropsWithChildren } from "react";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/display-name
export const HeaderButton = forwardRef(
  (
    { onClick, children, to, paddingX = 4 }: PropsWithChildren<any>,
    ref: any
  ) => {
    const classes = `reset-anchor cursor-pointer flex font-sans font-bold items-center px-${paddingX} relative focus:text-secondary hover:text-secondary transition-color text-gray-darker focus:text-gray-darker-active hover:text-gray-darker-active`;

    if (to) {
      return (
        <Link ref={ref} to={to} className={classes}>
          {children}
        </Link>
      );
    }

    return (
      <span ref={ref} onClick={onClick} className={classes}>
        {children}
      </span>
    );
  }
);

export const IfHeaderButton = withOptionalIf(HeaderButton);
