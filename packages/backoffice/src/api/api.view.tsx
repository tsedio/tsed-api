import React from "react";
import { Config } from "../config";

export function ApiViewSpec() {
  return (
    <div className={"relative -m-5"}>
      <iframe
        className='absolute w-full bottom-0 top-0 left-0'
        style={{ height: "calc(100vh - 60px)" }}
        src={`${Config.apiUrl.replace("/rest", "")}/doc-formio`}
      />
    </div>
  );
}
