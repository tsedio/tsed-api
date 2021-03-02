import React from "react";
import { toastr } from "../toastr/toastr.util";

export function HomeView() {
  return (
    <div>
      <button
        onClick={() => toastr.success("The title", "The message")}
        type='button'
      >
        Toastr Success
      </button>

      <button
        onClick={() => toastr.error("The title", "The message")}
        type='button'
      >
        Toastr error
      </button>
    </div>
  );
}
