import {Alter} from "@tsed/formio";

@Alter("submissionParams")
export class AlterSubmissionParams {
  transform(params: string[]) {
    return [...params, "oauth"];
  }
}
