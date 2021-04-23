import {UseCache} from "@tsed/common";
import {Injectable} from "@tsed/di";
import {HttpClient} from "../http/HttpClient";

@Injectable()
export class OpenCollectiveClient extends HttpClient {
  callee = "OPEN_COLLECTIVE";

  host = "https://opencollective.com";

  @UseCache({ttl: 3600})
  getMembers(repo: string) {
    return this.get(`${this.host}/${repo}/members/all.json`);
  }
}
