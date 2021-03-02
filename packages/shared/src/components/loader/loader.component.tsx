import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { Fade } from "../fade/fade.component";
import { BxIcon } from "../icon/bxIcon.component";

export interface LoaderProps {
  isActive?: boolean;
  color?: string;
  icon?: string;
  className?: string;
}

export function Loader({
  isActive,
  color = "blue",
  icon = "bx-radio-circle",
  className = ""
}: LoaderProps) {
  return (
    <div className={classnames("opacity-85 z-20 relative", className)}>
      <Fade show={isActive}>
        <div className='flex items-center justify-center p-5 fixed top-0 right-0 left-0 bottom-0 bg-white'>
          <BxIcon name={icon} color={color} className={"text-11xl bx-burst"} />
        </div>
      </Fade>
    </div>
  );
}

Loader.propTypes = {
  isActive: PropTypes.bool,
  icon: PropTypes.bool,
  color: PropTypes.string,
  className: PropTypes.string
};
