import {PlatformTest} from "@tsed/common";
import axios from "axios";
import {OpenCollectiveClient} from "./OpenCollectiveClient";

jest.mock("axios");

describe("OpenCollectiveClient", () => {
  beforeEach(() => {
    PlatformTest.create();
  });
  afterEach(() => {
    PlatformTest.reset();
  });
  it("should get all members", async () => {
    const service = PlatformTest.get<OpenCollectiveClient>(OpenCollectiveClient);
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

    const result = await service.getMembers("tsed");

    expect(result).toEqual(data);
  });
});
