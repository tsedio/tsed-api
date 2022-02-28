import classnames from "classnames";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../button/button.component";
import { Card } from "./card.component";

export interface HomeCardProps {
  title: string;
  icon: string | any;
  description: string;
  path: string;
  href?: string;
  ctaLabel: string;
  className?: string;
}

export function HomeCard({
  title,
  icon,
  description,
  href,
  path,
  ctaLabel,
  className
}: HomeCardProps) {
  return (
    <Card
      className={classnames("w-full sm:w-1/3 md:w-1/4 lg:w-1/5", className)}
      title={title}
      style={{ minWidth: "280px" }}
      icon={icon}
      description={description}
    >
      <Button className={"mb-5 mt-3"} component={Link} to={href || path}>
        {ctaLabel}
      </Button>
    </Card>
  );
}
