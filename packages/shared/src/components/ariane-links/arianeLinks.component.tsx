import { BxIcon } from "@tsed/shared";
import startCase from "lodash/startCase";
import toLower from "lodash/toLower";
import React from "react";
import { Link } from "react-router-dom";

function Title({ page }: any) {
  if (!page.form) {
    return page.title;
  }

  return (
    <>
      {page.form?.title ? (
        <>
          {page.form?.title}
          <BxIcon
            name={"chevron-right"}
            className={"text-md text-secondary mx-1 text-secondary"}
          />
          {startCase(toLower(page.formAction))}
        </>
      ) : (
        <>
          {startCase(toLower(page.formAction))}{" "}
          {page.formType.replace(/s$/, "")}
        </>
      )}
    </>
  );
}

export const ArianeLinks = ({ page }: any) => {
  return (
    <div className={"flex items-center relative"}>
      <span style={{ top: "-2px" }} className={"flex items-center mr-3"}>
        <BxIcon name={page.icon} className={"text-secondary"} />
      </span>

      {page.links.map((item: any, key: number) => {
        return (
          <span key={key} className='flex items-center'>
            {item.href ? (
              <Link to={item.href} className={"hover:text-secondary"}>
                {item.title}
              </Link>
            ) : (
              <span>{item.title}</span>
            )}
            <BxIcon
              name={"chevron-right"}
              className={"text-md text-secondary mx-1 text-secondary"}
            />
          </span>
        );
      })}

      <span className={"flex items-center"}>
        <Title page={page} />
      </span>
    </div>
  );
};
