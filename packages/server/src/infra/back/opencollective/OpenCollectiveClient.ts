import {Injectable} from "@tsed/di";
import {HttpClient} from "../http/HttpClient";

@Injectable()
export class OpenCollectiveClient extends HttpClient {
  callee = "OPEN_COLLECTIVE";

  host = "https://opencollective.com";

  getMembers(repo: string) {
    return this.get(`${this.host}/${repo}/members/all.json`);
  }
}
