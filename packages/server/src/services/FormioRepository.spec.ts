import {Injectable, PlatformTest} from "@tsed/common";
import {FormioDatabase} from "@tsed/formio";
import {FormioRepository} from "./FormioRepository";

@Injectable()
class PackagesRepository extends FormioRepository {
  formName = "package";
}

describe("FormioRepository", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("saveSubmission()", () => {
    it("should create submission", async () => {
      const database = {
        formModel: {
          findOne: jest.fn().mockResolvedValue({
            _id: "id"
          })
        },
        saveSubmission: jest.fn().mockImplementation((instance) => instance),
        submissionModel: class {
          constructor(o: any) {
            Object.assign(this, {...o, _id: o._id || "newid"});
          }
        }
      };

      const service = await PlatformTest.invoke<PackagesRepository>(PackagesRepository, [
        {
          token: FormioDatabase,
          use: database
        }
      ]);

      const result = await service.saveSubmission({
        data: {
          label: "label"
        }
      });

      expect(result).toEqual({
        _id: "newid",
        data: {
          label: "label"
        },
        form: "id"
      });
      expect(database.saveSubmission).toHaveBeenCalledWith({_id: "newid", data: {label: "label"}, form: "id"});
    });
    it("should save submission", async () => {
      const database = {
        formModel: {
          findOne: jest.fn().mockResolvedValue({
            _id: "id"
          })
        },
        saveSubmission: jest.fn().mockImplementation((instance) => instance),
        submissionModel: class {
          constructor(o: any) {
            Object.assign(this, {...o, _id: o._id || "newid"});
          }
        }
      };

      const service = await PlatformTest.invoke<PackagesRepository>(PackagesRepository, [
        {
          token: FormioDatabase,
          use: database
        }
      ]);

      const result = await service.saveSubmission({
        _id: "id",
        data: {
          label: "label"
        }
      });

      expect(result).toEqual({
        _id: "id",
        data: {
          label: "label"
        },
        form: "id"
      });
      expect(database.saveSubmission).toHaveBeenCalledWith({_id: "id", data: {label: "label"}, form: "id"});
    });
  });
  describe("getSubmissions()", () => {
    it("should get all saved submissions", async () => {
      const database = {
        formModel: {
          findOne: jest.fn().mockResolvedValue({
            _id: "id"
          })
        },
        submissionModel: {
          find: jest.fn().mockResolvedValue([])
        }
      };

      const service = await PlatformTest.invoke<PackagesRepository>(PackagesRepository, [
        {
          token: FormioDatabase,
          use: database
        }
      ]);

      const submissions = await service.getSubmissions();

      expect(submissions).toEqual([]);
      expect(database.formModel.findOne).toHaveBeenCalledWith({
        name: {
          $eq: "package"
        }
      });
      expect(database.submissionModel.find).toHaveBeenCalledWith({deleted: null, form: "id"});
    });
  });
  describe("findOneSubmission()", () => {
    it("should find on submission", async () => {
      const database = {
        formModel: {
          findOne: jest.fn().mockResolvedValue({
            _id: "id"
          })
        },
        submissionModel: {
          findOne: jest.fn().mockResolvedValue({_id: "id"})
        }
      };

      const service = await PlatformTest.invoke<PackagesRepository>(PackagesRepository, [
        {
          token: FormioDatabase,
          use: database
        }
      ]);

      const submission = await service.findOneSubmission({});

      expect(submission).toEqual({_id: "id"});
      expect(database.formModel.findOne).toHaveBeenCalledWith({
        name: {
          $eq: "package"
        }
      });
      expect(database.submissionModel.findOne).toHaveBeenCalledWith({deleted: null, form: "id"});
    });
  });
});
