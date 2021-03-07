import {PlatformTest} from "@tsed/common";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import SuperTest from "supertest";
import {GithubClient} from "../../../infra/back/github/GithubClient";
import {Server} from "../__mock__/ServerTest";
import {GithubCtrl} from "./GithubCtrl";

describe("GithubCtrl", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  beforeAll(
    TestMongooseContext.bootstrap(Server, {
      cache: false,
      mount: {
        "/rest": [GithubCtrl]
      }
    })
  );
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(() => TestMongooseContext.reset());

  describe("get()", () => {
    it("should get project information", async () => {
      const githubClient = PlatformTest.get<GithubClient>(GithubClient);

      jest.spyOn(githubClient.repos, "get").mockResolvedValue({
        headers: {etag: "etag", date: "date"},
        data: {
          id: 52221518,
          stargazers_count: 1552,
          watchers_count: 1552,
          forks_count: 163,
          open_issues_count: 29
        }
      } as any);

      const {body} = await request.get("/rest/github/typedproject/tsed").expect(200);

      expect(body).toEqual({
        id: 52221518,
        stargazers_count: 1552,
        watchers_count: 1552,
        forks_count: 163,
        open_issues_count: 29
      });
    });
  });

  describe("getContributors()", () => {
    it("should get contributors", async () => {
      const githubClient = PlatformTest.get<GithubClient>(GithubClient);
      const data = [
        {
          login: "Romakita",
          id: 1763311,
          node_id: "MDQ6VXNlcjE3NjMzMTE=",
          avatar_url: "https://avatars.githubusercontent.com/u/1763311?v=4",
          gravatar_id: "",
          url: "https://api.github.com/users/Romakita",
          html_url: "https://github.com/Romakita",
          followers_url: "https://api.github.com/users/Romakita/followers",
          following_url: "https://api.github.com/users/Romakita/following{/other_user}",
          gists_url: "https://api.github.com/users/Romakita/gists{/gist_id}",
          starred_url: "https://api.github.com/users/Romakita/starred{/owner}{/repo}",
          subscriptions_url: "https://api.github.com/users/Romakita/subscriptions",
          organizations_url: "https://api.github.com/users/Romakita/orgs",
          repos_url: "https://api.github.com/users/Romakita/repos",
          events_url: "https://api.github.com/users/Romakita/events{/privacy}",
          received_events_url: "https://api.github.com/users/Romakita/received_events",
          type: "User",
          site_admin: false,
          contributions: 1933
        }
      ];
      jest.spyOn(githubClient.repos, "listContributors").mockResolvedValue({
        headers: {etag: "etag", date: "date"},
        data
      } as any);

      const {body} = await request.get("/rest/github/typedproject/tsed/contributors").expect(200);

      expect(body).toEqual(data);
    });
  });

  describe("getReleases()", () => {
    it("should get releases", async () => {
      const githubClient = PlatformTest.get<GithubClient>(GithubClient);
      const data = [
        {
          url: "https://api.github.com/repos/TypedProject/tsed/releases/38791984",
          assets_url: "https://api.github.com/repos/TypedProject/tsed/releases/38791984/assets",
          upload_url: "https://uploads.github.com/repos/TypedProject/tsed/releases/38791984/assets{?name,label}",
          html_url: "https://github.com/TypedProject/tsed/releases/tag/v6.26.4",
          id: 38791984,
          author: {
            login: "string",
            id: "string",
            node_id: "string",
            avatar_url: "string",
            gravatar_id: "string",
            url: "string",
            html_url: "string",
            followers_url: "string",
            following_url: "string",
            gists_url: "string",
            starred_url: "string",
            subscriptions_url: "string",
            organizations_url: "string",
            repos_url: "string",
            events_url: "string",
            received_events_url: "string",
            type: "string",
            site_admin: "string",
            contributions: 0
          },
          node_id: "MDc6UmVsZWFzZTM4NzkxOTg0",
          tag_name: "v6.26.4",
          target_commitish: "production",
          name: "v6.26.4",
          draft: true,
          prerelease: true,
          created_at: "2021-02-26T10:35:52Z",
          published_at: "2021-02-26T10:36:31Z",
          assets: [{}],
          tarball_url: "https://api.github.com/repos/TypedProject/tsed/tarball/v6.26.4",
          zipball_url: "https://api.github.com/repos/TypedProject/tsed/zipball/v6.26.4",
          body: "string"
        }
      ];
      jest.spyOn(githubClient.repos, "listReleases").mockResolvedValue({
        headers: {etag: "etag", date: "date"},
        data
      } as any);

      const {body} = await request.get("/rest/github/typedproject/tsed/releases").expect(200);

      expect(body).toEqual(data);
    });
  });
});
