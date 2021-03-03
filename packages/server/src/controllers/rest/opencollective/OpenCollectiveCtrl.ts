import {Controller, Get} from "@tsed/common";
import {Inject} from "@tsed/di";
import {any, array, boolean, datetime, email, number, object, Returns, string, url} from "@tsed/schema";
import {OpenCollectiveClient} from "../../../infra/back/opencollective/OpenCollectiveClient";

const OpenCollectiveMemberSchema = object({
  MemberId: number().required().example(13382),
  createdAt: datetime().required().example("2018-03-01 22:31"),
  type: string().required().enum(["ORGANIZATION", "USER"]).example("USER"),
  role: string().required().enum(["ADMIN", "HOST", "BACKER", "CONTRIBUTOR"]).example("CONTRIBUTOR"),
  isActive: boolean().required().example(true),
  totalAmountDonated: number().required().example(0),
  currency: string().required().example("USD"),
  lastTransactionAt: datetime().required().example("2020-07-02 22:41"),
  lastTransactionAmount: number().required().example(-200),
  profile: string().required().example("https://opencollective.com/romlenzotti"),
  name: string().required().example("Romain Lenzotti"),
  company: any("string", "null").required(),
  description: string().required().example("Tech Lead Front-End | Fullstack à Zenika | #nodejs #react #vuejs #typescript #javascript"),
  image: url().required().example("https://d1ts43dypk8bqh.cloudfront.net/v1/avatars/b6bb2e17-d2bb-4e2f-8743-6e25f2b6a786"),
  email: email().required().example(),
  twitter: url().required().example("https://twitter.com/RomainLenzotti"),
  github: url().required().example("https://github.com/Romakita"),
  website: url().required().example("https://tsed.io")
}).label("OpenCollectiveMemberSchema");

const OpenCollectiveMembersSchema = array().items(OpenCollectiveMemberSchema).label("OpenCollectiveMembersSchema");

@Controller("/opencollective")
export class OpenCollectiveCtrl {
  @Inject()
  client: OpenCollectiveClient;

  @Get()
  @(Returns(200).ContentType("application/json").Schema(OpenCollectiveMembersSchema))
  getMember() {
    return this.client.getMembers("tsed");
  }
}
