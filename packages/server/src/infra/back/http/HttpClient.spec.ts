import {PlatformTest} from "@tsed/common";
import {OnSerialize} from "@tsed/json-mapper";
import {Name, Property, Required} from "@tsed/schema";
import axios from "axios";
import moment from "moment";
import {HttpClient} from "./HttpClient";

jest.mock("axios");

function serializeDate(date: Date) {
  return date && moment(date).format("YYYYMMDD");
}

export class ProposalsSearchParameters {
  @Name("product_id")
  @Required()
  productId: string;

  @Name("resort_arrival_date")
  @OnSerialize(serializeDate)
  @Required()
  resortArrivalDate: Date;

  @Required()
  duration: number;

  @Name("number_attendees")
  @Required()
  numberAttendees: number;
}

class Model {
  @Property()
  id: string;

  [key: string]: any;

  constructor({id, ...props}: any = {}) {
    this.id = id;
    Object.assign(this, props);
  }
}

class Model2 {
  @Property()
  id: string;

  constructor({id}: any = {}) {
    this.id = id;
  }
}

describe("HttpClient", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("head()", () => {
    it("should head method", async () => {
      // GIVEN
      const client = await PlatformTest.invoke<HttpClient>(HttpClient);

      const ctx = PlatformTest.createRequestContext();
      ctx.set("host", "host.fr");
      ctx.set("protocol", "https");

      (axios as any).mockReturnValue(
        Promise.resolve({
          headers: {
            "x-request-id": "id"
          }
        })
      );

      // WHEN
      const result = await client.head("/test", {
        params: {},
        headers: {
          "x-request-id": "id"
        },
        type: Model2
      });

      expect(result).toEqual({
        "x-request-id": "id"
      });
      expect(axios).toHaveBeenCalledWith({
        url: "/test",
        method: "HEAD",
        params: {},
        data: undefined,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-request-id": "id"
        }
      });
    });
  });
  describe("get()", () => {
    it("should call call send (without additionalProperties)", async () => {
      // GIVEN
      const client = await PlatformTest.invoke<HttpClient>(HttpClient);

      const model = new ProposalsSearchParameters();
      model.productId = "AGAC";
      model.resortArrivalDate = new Date("2020-05-01");
      model.duration = 7;
      model.numberAttendees = 2;

      const ctx = PlatformTest.createRequestContext();
      ctx.set("host", "host.fr");
      ctx.set("protocol", "https");

      (axios as any).mockReturnValue(
        Promise.resolve({
          headers: {},
          data: {
            id: "id",
            additionalProperties: "hello"
          }
        })
      );

      // WHEN
      const result = await client.get("/test", {
        params: model,
        headers: {
          "x-api": "x-api"
        },
        type: Model2
      });

      expect(result).toEqual(
        new Model({
          id: "id"
        })
      );
      expect(axios).toHaveBeenCalledWith({
        url: "/test",
        method: "GET",
        params: {
          duration: 7,
          number_attendees: 2,
          product_id: "AGAC",
          resort_arrival_date: "20200501"
        },
        data: undefined,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-api": "x-api"
        },
        paramsSerializer: expect.any(Function)
      });
    });
    it("should call call send (with additionalProperties)", async () => {
      // GIVEN
      const client = await PlatformTest.invoke<HttpClient>(HttpClient);

      const model = new ProposalsSearchParameters();
      model.productId = "AGAC";
      model.resortArrivalDate = new Date("2020-05-01");
      model.duration = 7;
      model.numberAttendees = 2;

      (axios as any).mockReturnValue(
        Promise.resolve({
          headers: {},
          data: {
            id: "id",
            hello: "hello"
          }
        })
      );

      // WHEN
      const result = await client.get("/test", {
        params: model,
        headers: {
          "x-api": "x-api"
        },
        type: Model,
        additionalProperties: true
      });

      expect(result).toEqual(
        new Model({
          hello: "hello",
          id: "id"
        })
      );
      expect(axios).toHaveBeenCalledWith({
        url: "/test",
        method: "GET",
        params: {
          duration: 7,
          number_attendees: 2,
          product_id: "AGAC",
          resort_arrival_date: "20200501"
        },
        data: undefined,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-api": "x-api"
        },
        paramsSerializer: expect.any(Function)
      });
    });
  });
  describe("post()", () => {
    it("should call call send (without additionalProperties)", async () => {
      // GIVEN
      const client = await PlatformTest.invoke<HttpClient>(HttpClient);

      const model = new ProposalsSearchParameters();
      model.productId = "AGAC";
      model.resortArrivalDate = new Date("2020-05-01");
      model.duration = 7;
      model.numberAttendees = 2;

      (axios as any).mockReturnValue(
        Promise.resolve({
          headers: {},
          data: {
            id: "id",
            additionalProperties: "hello"
          }
        })
      );

      // WHEN
      const result = await client.post("/test", {
        data: model,
        headers: {
          "x-api": "x-api"
        },
        type: Model2
      });

      expect(result).toEqual(
        new Model({
          id: "id"
        })
      );
      expect(axios).toHaveBeenCalledWith({
        url: "/test",
        method: "POST",
        params: undefined,
        data: {
          duration: 7,
          number_attendees: 2,
          product_id: "AGAC",
          resort_arrival_date: "20200501"
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-api": "x-api"
        },
        paramsSerializer: expect.any(Function)
      });
    });
    it("should call call send (with additionalProperties)", async () => {
      // GIVEN
      const client = await PlatformTest.invoke<HttpClient>(HttpClient);

      const model = new ProposalsSearchParameters();
      model.productId = "AGAC";
      model.resortArrivalDate = new Date("2020-05-01");
      model.duration = 7;
      model.numberAttendees = 2;

      (axios as any).mockReturnValue(
        Promise.resolve({
          headers: {},
          data: {
            id: "id",
            hello: "hello"
          }
        })
      );

      // WHEN
      const result = await client.post("/test", {
        data: model,
        headers: {
          "x-api": "x-api"
        },
        type: Model,
        additionalProperties: true
      });

      expect(result).toEqual(
        new Model({
          hello: "hello",
          id: "id"
        })
      );
      expect(axios).toHaveBeenCalledWith({
        url: "/test",
        method: "POST",
        data: {
          duration: 7,
          number_attendees: 2,
          product_id: "AGAC",
          resort_arrival_date: "20200501"
        },
        params: undefined,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-api": "x-api"
        },
        paramsSerializer: expect.any(Function)
      });
    });
  });
  describe("put()", () => {
    it("should call call send (without additionalProperties)", async () => {
      // GIVEN
      const client = await PlatformTest.invoke<HttpClient>(HttpClient);

      const model = new ProposalsSearchParameters();
      model.productId = "AGAC";
      model.resortArrivalDate = new Date("2020-05-01");
      model.duration = 7;
      model.numberAttendees = 2;

      (axios as any).mockReturnValue(
        Promise.resolve({
          headers: {},
          data: {
            id: "id",
            additionalProperties: "hello"
          }
        })
      );

      // WHEN
      const result = await client.put("/test", {
        data: model,
        headers: {
          "x-api": "x-api"
        },
        type: Model2
      });

      expect(result).toEqual(
        new Model({
          id: "id"
        })
      );
      expect(axios).toHaveBeenCalledWith({
        url: "/test",
        method: "PUT",
        params: undefined,
        data: {
          duration: 7,
          number_attendees: 2,
          product_id: "AGAC",
          resort_arrival_date: "20200501"
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-api": "x-api"
        },
        paramsSerializer: expect.any(Function)
      });
    });
    it("should call call send (with additionalProperties)", async () => {
      // GIVEN
      const client = await PlatformTest.invoke<HttpClient>(HttpClient);

      const model = new ProposalsSearchParameters();
      model.productId = "AGAC";
      model.resortArrivalDate = new Date("2020-05-01");
      model.duration = 7;
      model.numberAttendees = 2;

      (axios as any).mockReturnValue(
        Promise.resolve({
          headers: {},
          data: {
            id: "id",
            hello: "hello"
          }
        })
      );

      // WHEN
      const result = await client.put("/test", {
        data: model,
        headers: {
          "x-api": "x-api"
        },
        type: Model,
        additionalProperties: true
      });

      expect(result).toEqual(
        new Model({
          hello: "hello",
          id: "id"
        })
      );
      expect(axios).toHaveBeenCalledWith({
        url: "/test",
        method: "PUT",
        data: {
          duration: 7,
          number_attendees: 2,
          product_id: "AGAC",
          resort_arrival_date: "20200501"
        },
        params: undefined,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-api": "x-api"
        },
        paramsSerializer: expect.any(Function)
      });
    });
  });
  describe("delete()", () => {
    it("should call call send (without additionalProperties)", async () => {
      // GIVEN
      const client = await PlatformTest.invoke<HttpClient>(HttpClient);

      const model = new ProposalsSearchParameters();
      model.productId = "AGAC";
      model.resortArrivalDate = new Date("2020-05-01");
      model.duration = 7;
      model.numberAttendees = 2;

      const ctx = PlatformTest.createRequestContext();
      ctx.set("host", "host.fr");
      ctx.set("protocol", "https");

      (axios as any).mockReturnValue(
        Promise.resolve({
          headers: {},
          data: {
            id: "id",
            additionalProperties: "hello"
          }
        })
      );

      // WHEN
      const result = await client.delete("/test", {
        params: model,
        headers: {
          "x-api": "x-api"
        },
        type: Model2
      });

      expect(result).toEqual(
        new Model({
          id: "id"
        })
      );
      expect(axios).toHaveBeenCalledWith({
        url: "/test",
        method: "DELETE",
        params: {
          duration: 7,
          number_attendees: 2,
          product_id: "AGAC",
          resort_arrival_date: "20200501"
        },
        data: undefined,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-api": "x-api"
        },
        paramsSerializer: expect.any(Function)
      });
    });
    it("should call call send (with additionalProperties)", async () => {
      // GIVEN
      const client = await PlatformTest.invoke<HttpClient>(HttpClient);

      const model = new ProposalsSearchParameters();
      model.productId = "AGAC";
      model.resortArrivalDate = new Date("2020-05-01");
      model.duration = 7;
      model.numberAttendees = 2;

      (axios as any).mockReturnValue(
        Promise.resolve({
          headers: {},
          data: {
            id: "id",
            hello: "hello"
          }
        })
      );

      // WHEN
      const result = await client.delete("/test", {
        params: model,
        headers: {
          "x-api": "x-api"
        },
        type: Model,
        additionalProperties: true
      });

      expect(result).toEqual(
        new Model({
          hello: "hello",
          id: "id"
        })
      );
      expect(axios).toHaveBeenCalledWith({
        url: "/test",
        method: "DELETE",
        params: {
          duration: 7,
          number_attendees: 2,
          product_id: "AGAC",
          resort_arrival_date: "20200501"
        },
        data: undefined,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-api": "x-api"
        },
        paramsSerializer: expect.any(Function)
      });
    });
  });
});
