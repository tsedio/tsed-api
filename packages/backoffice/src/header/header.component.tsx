import { ArianeLinks, BxIcon, withIf } from "@tsed/shared";
import { AuthState, useTooltip } from "@tsed/react-formio";
import noop from "lodash/noop";
import React from "react";
import { Config } from "../config";
import { HeaderButton } from "./header.button.component";

export interface HeaderProps {
  auth?: AuthState;
  className?: string;
  height?: string;
  title?: string;
  onLogout?: () => void;
  page?: any;
  currentTitle?: any;
}

export function Header(props: HeaderProps) {
  const {
    auth,
    className = "",
    height = "65px",
    title,
    onLogout = noop,
    page
  } = props;

  const signoutRef = useTooltip({
    title: "Logout"
  });

  return (
    <div style={{ height }}>
      <header
        style={{ height }}
        className={`mb-5 fixed left-0 top-0 right-0 z-10 transition-all ${className}`}
      >
        <div className='absolute top-0 inset-x-0 z-4'>
          <div
            className='fadeInLong absolute bg-white top-0 inset-x-0'
            aria-label={`${title} main navigation`}
          >
            <div
              className={
                "border-b-1 border-gray-light flex items-stretch justify-between px-5"
              }
              style={{ height }}
            >
              <ul
                aria-label={`${title} main navigation`}
                className='reset-list flex'
                role='menubar'
                style={{ flex: "1 1 auto" }}
              >
                <li className='flex items-stretch'>
                  {page && <ArianeLinks page={page} />}
                </li>
              </ul>

              <div className='flex flex-no-shrink relative'>
                <div className={"flex relative px-4 items-center"}>
                  {page && page.headerNav && <page.headerNav page={page} />}
                </div>

                <HeaderButton to={Config.auth.profile.path}>
                  <span
                    className={
                      "bg-gray-light p-1 flex items-center rounded-full justify-center mr-1 text-white"
                    }
                  >
                    <BxIcon name={"user"} className={"text-sm"} />
                  </span>
                  <span className='ml-1'>
                    {auth.user.data.fullName || auth.user.data.email}
                  </span>
                </HeaderButton>

                <HeaderButton
                  ref={signoutRef}
                  paddingX={0}
                  className={"header__link-logout ml-2"}
                  onClick={onLogout}
                >
                  <BxIcon name={"power-off"} className={"text-md"} />
                </HeaderButton>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export const IfHeader = withIf(Header);
