import PropTypes from "prop-types";
import React, { PropsWithChildren, useEffect, useState } from "react";

export function Fade({
  show,
  children
}: PropsWithChildren<{ show?: boolean }>) {
  const [shouldRender, setRender] = useState(show);

  useEffect(() => {
    if (show) setRender(true);
  }, [show]);

  const onAnimationEnd = () => {
    if (!show) setRender(false);
  };

  return shouldRender ? (
    <div
      className={show ? "w-full fadeIn" : "w-full fadeOut"}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </div>
  ) : null;
}

Fade.propTypes = {
  show: PropTypes.bool
};
