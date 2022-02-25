import {InjectContext} from "@tsed/async-hook-context";
import {PlatformContext, UseCache} from "@tsed/common";
import {Injectable} from "@tsed/di";
import {deserialize} from "@tsed/json-mapper";
import {Method} from "axios";
import url from "url";
import {NpmPackage} from "../../../domain/npm/NpmPackage";
import {HttpClient, HttpClientOptions} from "../http/HttpClient";

const REGEX_REGISTRY_ENFORCED_HTTPS = /^https?:\/\/([^\/]+\.)?(yarnpkg\.com|npmjs\.(org|com))(\/|$)/;
const REGEX_REGISTRY_PREFIX = /^(https?:)?\/\//i;
const REGEX_EXCLUDED_KEYWORDS = /hentai|porn/gi;

export function addSuffix(pattern: string, suffix: string): string {
  if (!pattern.endsWith(suffix)) {
    return pattern + suffix;
  }

  return pattern;
}

export const SCOPE_SEPARATOR = "%2f";

export interface NpmSearchResponse {
  objects: {package: any; score: any; searchScore: any}[];
}

export interface NpmRequestOptions extends HttpClientOptions {
  host?: string;
  unfiltered?: boolean;
  retry?: number;
}

@Injectable()
export class NpmClient extends HttpClient {
  hostRegistry = "https://registry.npmjs.org";
  hostApi = "https://api.npmjs.org";

  @InjectContext()
  context?: PlatformContext;

  static escapeName(name: string): string {
    // scoped packages contain slashes and the npm registry expects them to be escaped
    return name.replace("/", SCOPE_SEPARATOR);
  }

  getOptions(method: Method, endpoint: string, options: NpmRequestOptions): any {
    endpoint = this.getRequestUrl(options.host || this.hostRegistry, endpoint);
    options = super.getOptions(method, endpoint, options);

    return {
      ...options,
      headers: {
        Accept: options.unfiltered ? "application/json" : "application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*",
        ...options.headers
      }
    };
  }

  getRequestUrl(registry: string, pathname: string): string {
    let resolved = pathname;

    if (!REGEX_REGISTRY_PREFIX.test(pathname)) {
      resolved = url.resolve(addSuffix(registry, "/"), pathname);
    }

    if (REGEX_REGISTRY_ENFORCED_HTTPS.test(resolved)) {
      resolved = resolved.replace(/^http:\/\//, "https://");
    }

    return resolved;
  }

  /**
   * Search a module on npm registry
   * @param text
   * @param options
   */
  @UseCache({
    ttl: 3600 * 24 * 10,
    refreshThreshold: 900,
    type: NpmPackage,
    collectionType: Array,
    key([type]: string[]): string {
      return `npm:search:${type}`;
    }
  })
  async search(
    text: string,
    options: {size?: number; from?: number; quality?: number; popularity?: number; maintenance?: number} = {}
  ): Promise<NpmPackage[]> {
    const {objects: result} = await this.get<NpmSearchResponse>(`-/v1/search`, {
      headers: {
        "Accept-Encoding": "gzip"
      },
      params: {
        text,
        size: 100,
        from: 0,
        quality: 0.65,
        popularity: 0.98,
        maintenance: 0.5,
        ...options
      }
    });

    const promises = result
      .filter(({package: obj}) => !obj.name.match(REGEX_EXCLUDED_KEYWORDS))
      .map<Promise<NpmPackage>>(async ({package: {links, ...props}}) => {
        const downloads = await this.downloads(props.name);

        return deserialize(
          {
            ...props,
            repository: links.repository,
            homepage: links.homepage,
            npm: links.npm,
            bugs: links.bugs,
            downloads
          },
          {type: NpmPackage}
        );
      })
      .filter(Boolean);

    return await Promise.all(promises);
  }

  async downloads(pkg: string): Promise<number> {
    try {
      const {downloads} = await this.get<{downloads: number}>(`/downloads/point/last-month/${pkg}`, {
        host: this.hostApi
      });

      return downloads;
    } catch (er) {
      this.context?.logger.warn({message: "Unable to get downloads for the following packages", pkg, error: er});
      return 0;
    }
  }
}
