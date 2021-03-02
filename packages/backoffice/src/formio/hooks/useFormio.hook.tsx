import { hideLoader, oneOfIsActive, showLoader } from "@tsed/shared";
import { Submission } from "@tsed/react-formio";
import { useDispatch, useSelector } from "react-redux";
import { toastr } from "../../toastr/toastr.util";

export interface UseFormLoaderProps extends Record<string, any> {
  name: string;
  src?: string;
  onSubmitDone?: (submission: Submission) => void;
}

function mapErrors(errors: Error | Error[]) {
  errors = [].concat(errors);

  if (errors.length === 1) {
    return errors[0].message;
  }

  return errors.map((error) => error.message).join("\n");
}

export function useFormio({ name, src, ...props }: UseFormLoaderProps) {
  const dispatch = useDispatch();
  const isActive = useSelector(oneOfIsActive("loader"));

  return {
    ...props,
    src,
    isActive,
    onError(errors: Error | Error[]) {
      toastr.error(
        `Please fix the following errors before submitting`,
        mapErrors(errors)
      );
    },
    onSubmit() {
      dispatch(showLoader(name));
    },
    onSubmitDone(submission: Submission) {
      props.onSubmitDone && props.onSubmitDone(submission);
      dispatch(hideLoader(name));
    },
    onFormLoad() {
      dispatch(showLoader(name));
    },
    onInitialized() {
      setTimeout(() => dispatch(hideLoader(name)), 300);
    }
  };
}
