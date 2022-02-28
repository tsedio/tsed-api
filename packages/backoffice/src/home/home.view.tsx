import React from "react";
import { useNav } from "../nav/useNav.hook";
import { HomeComponent } from "./home.component";

export function HomeView() {
  const nav = useNav();
  return <HomeComponent items={nav.getNav("home")} />;
}
