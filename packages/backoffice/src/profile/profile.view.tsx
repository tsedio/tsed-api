import { Form } from "@tsed/react-formio";
import classnames from "classnames";
import React from "react";
import { useAuth } from "../auth/useAuth.hook";
import { Config } from "../config";
import { useFormio } from "../formio/hooks/useFormio.hook";

function FormProfile({ auth }: any) {
  const formLoader = useFormio({
    name: "loader",
    src: `${Config.formioUrl}/form/${auth?.user?.form}`,
    submission: auth?.user
  });

  return <Form className={"p-5"} {...formLoader} />;
}

function FormSocialLogin({ auth }: any) {
  const formLoader = useFormio({
    name: "loader",
    src: `${Config.formioUrl}/${Config.auth.profile.oauthLinksForm}`,
    submission: auth?.user
  });

  return (
    <div>
      <h3
        className={
          "text-left border-b-1 border-gray-300 text-xl pb-1 flex items-center mt-3 mx-5"
        }
      >
        Social logins
      </h3>
      <Form className={"p-5"} {...formLoader} />
    </div>
  );
}

export const ProfileView = () => {
  const { auth } = useAuth();

  return (
    <div className={classnames("flex justify-center flex-wrap")}>
      <div className='w-full h-full '>
        <div className='border-1 border-gray-300 bg-white shadow-lg rounded-sm relative mb-5 max-w-screen-md'>
          <h2
            className={
              "text-left border-b-1 border-gray-300 text-xl pb-1 flex items-center mt-3 mx-5"
            }
          >
            Edit profile
          </h2>

          <FormProfile auth={auth} />

          {Config.auth.profile.oauthLinksForm && (
            <FormSocialLogin auth={auth} />
          )}
        </div>
      </div>
    </div>
  );
};
