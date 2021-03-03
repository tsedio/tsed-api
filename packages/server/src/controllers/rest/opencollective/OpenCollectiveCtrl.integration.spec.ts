import {PlatformTest} from "@tsed/common";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import axios from "axios";
import SuperTest from "supertest";
import {Server} from "../__mock__/ServerTest";
import {OpenCollectiveCtrl} from "./OpenCollectiveCtrl";

jest.mock("axios");

describe("OpenCollectiveCtrl", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  beforeAll(
    TestMongooseContext.bootstrap(Server, {
      mount: {
        "/rest": [OpenCollectiveCtrl]
      }
    })
  );
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(() => TestMongooseContext.reset());

  describe("get()", () => {
    it("should get project information", async () => {
      const data = [
        {
          MemberId: 13382,
          createdAt: "2018-03-01 22:31",
          type: "USER",
          role: "ADMIN",
          isActive: true,
          totalAmountDonated: 0,
          currency: "USD",
          lastTransactionAt: "2020-07-02 22:41",
          lastTransactionAmount: -200,
          profile: "https://opencollective.com/romlenzotti",
          name: "Romain Lenzotti"
        }
      ];

      (axios as any).mockReturnValue(
        Promise.resolve({
          data
        })
      );

      const {body} = await request.get("/rest/opencollective").expect(200);

      expect(body).toEqual(data);
    });
  });
});
