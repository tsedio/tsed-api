import { BxIcon } from "@project/shared";
import { Form, initAuth, setUser, Submission } from "@tsed/react-formio";
import classnames from "classnames";
import { push } from "connected-react-router";
import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Config } from "../config";
import { useFormio } from "../formio/hooks/useFormio.hook";

export function AuthView() {
  const dispatch = useDispatch();
  const formLoader = useFormio({
    name: "loader",
    src: `${Config.formioUrl}/${Config.auth.login.form}`,
    onSubmitDone(submission: Submission) {
      dispatch(
        initAuth(() => {
          dispatch(setUser(submission));
          dispatch(push(Config.auth.dashboard.path));
        })
      );
    }
  });

  return (
    <div
      className={classnames(
        "flex justify-center flex-wrap pt-30",
        formLoader.isActive && "hidden"
      )}
    >
      <div className='w-full h-full max-w-xs'>
        {/* <div className='p-10 flex justify-center text-blue'> */}
        {/*  <h1 className='text-4xl'>{projectTitle}</h1> */}
        {/* </div> */}

        <div className='border-1 border-gray-300 bg-white shadow-lg rounded relative mb-5'>
          <h2 className={"text-center font-bold text-lg mt-3"}>
            Log into your account
          </h2>
          <Form className={"p-5"} {...formLoader} />
        </div>
        <div className={"flex flex-col items-center"}>
          <Link
            className={
              "flex items-center text-sm font-bold text-gray-500 hover:text-secondary focus:text-secondary transition-colors"
            }
            to={Config.auth.register.path}
          >
            <span className={"underline"}>Create an account</span>
            <BxIcon name={"chevron-right"} className={"-mb-px"} />
          </Link>
        </div>
      </div>
    </div>
  );
}
