import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";

export interface BxIconProps extends Record<string, unknown> {
  name: string;
  color?: string;
  size?: string;
  className?: string;
}

// eslint-disable-next-line react/display-name
export const BxIcon = ({ name, color, className = "" }: BxIconProps) => {
  className = classnames(
    "bx",
    name.includes("bx") ? name : `bx-${name}`,
    color ? `text-${color}` : "",
    className
  );

  return <i data-testid={"icon"} className={className} />;
};

BxIcon.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string
};
