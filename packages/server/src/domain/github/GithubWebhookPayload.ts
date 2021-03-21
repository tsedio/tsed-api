import {AdditionalProperties, Name, Property, Required} from "@tsed/schema";

export class GithubRepository {
  @Property()
  id: string;

  @Property()
  name: string;

  @Name("full_name")
  fullName: string;
}

export class GithubHookSender {
  @Property()
  id: string;

  @Property()
  login: string;

  @Property()
  type: string;
}

@AdditionalProperties(true)
export class GithubWebhookPayload {
  @Property(String)
  action = "";

  @Required()
  repository: GithubRepository;

  @Required()
  sender: GithubHookSender;
}
