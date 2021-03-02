import { BxIcon } from "@tsed/shared";
import { resetForm, resetSubmission } from "@tsed/react-formio";
import { push } from "connected-react-router";
import React from "react";
import { useDispatch } from "react-redux";
import { getFormioBasePath } from "../../../config";

export function CreateFormButton({ page }: any) {
  const dispatch = useDispatch();
  const onClickForm = () => {
    dispatch(resetForm(page.formType.replace(/s$/, "")));
    dispatch(push(getFormioBasePath(page.formType, "create")));
  };

  const onClickData = () => {
    dispatch(resetSubmission("submissions"));
    dispatch(
      push(
        getFormioBasePath(page.formType, page.formId, "submissions", "create")
      )
    );
  };

  return (
    <>
      <button
        onClick={onClickForm}
        className={`btn btn-outline-success btn-sm flex items-center mr-2`}
      >
        Create {page.formType.replace(/s$/, "")}
        <BxIcon name={page.icon} className={"ml-2"} />
      </button>
      {page.formId && (
        <button
          onClick={onClickData}
          className={`btn btn-success btn-sm flex items-center`}
        >
          Add data
          <BxIcon name={"data"} className={"ml-2"} />
        </button>
      )}
    </>
  );
}
