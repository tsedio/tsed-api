import {Inject} from "@tsed/di";
import {FormioDatabase, FormioSubmission} from "@tsed/formio";
import {MongooseDocument, MongooseModel} from "@tsed/mongoose";

export abstract class FormioRepository<SubmissionData = any> {
  @Inject()
  protected formioDatabase: FormioDatabase;
  protected formName: string;
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

  async updateSubmission(submission: Omit<Partial<FormioSubmission<SubmissionData>>, "form">) {
    return this.formioDatabase.submissionModel.updateOne(
      {
        _id: submission._id
      },
      submission,
      {upsert: true}
    );
  }

  async saveSubmission(
    submission: Omit<Partial<FormioSubmission<SubmissionData>>, "form">
  ): Promise<MongooseDocument<FormioSubmission<SubmissionData>>> {
    return new this.formioDatabase.submissionModel({
      ...submission,
      form: await this.getFormId()
    }).save();
  }

  async getSubmissions(): Promise<MongooseDocument<FormioSubmission<SubmissionData>>[]> {
    return this.formioDatabase.submissionModel.find({
      form: await this.getFormId()
    }) as any;
  }

  async findOneSubmission(query: any): Promise<MongooseDocument<FormioSubmission<SubmissionData>> | undefined> {
    return this.formioDatabase.submissionModel.findOne({
      form: await this.getFormId(),
      ...query
    }) as any;
  }
}
