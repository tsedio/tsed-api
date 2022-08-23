import {Inject} from "@tsed/di";
import {FormioDatabase, FormioSubmission} from "@tsed/formio";
import {MongooseDocument} from "@tsed/mongoose";

export abstract class FormioRepository<SubmissionData = any> {
  @Inject()
  protected formioDatabase: FormioDatabase;

  protected abstract formName: string;

  private formId: string;

  async getFormId() {
    if (!this.formId) {
      const form = await this.formioDatabase.formModel.findOne({name: {$eq: this.formName}});

      if (form) {
        this.formId = form._id;
      }
    }

    return this.formId;
  }

  async saveSubmission(submission: Omit<Partial<FormioSubmission<SubmissionData>>, "form"> & {form?: any}) {
    submission.form = submission.form || (await this.getFormId());

    return this.formioDatabase.saveSubmission(new this.formioDatabase.submissionModel(submission));
  }

  async getSubmissions(): Promise<MongooseDocument<FormioSubmission<SubmissionData>>[]> {
    return this.formioDatabase.submissionModel.find({
      form: await this.getFormId(),
      deleted: null
    }) as any;
  }

  async findOneSubmission(query: any): Promise<MongooseDocument<FormioSubmission<SubmissionData>> | undefined> {
    return this.formioDatabase.submissionModel.findOne({
      form: await this.getFormId(),
      deleted: null,
      ...query
    }) as any;
  }
}
