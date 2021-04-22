import {ConverterService, Inject} from "@tsed/common";
import {cleanObject, Type} from "@tsed/core";
import {Injectable} from "@tsed/di";
import {Exception} from "@tsed/exceptions";
import axios, {AxiosRequestConfig, Method} from "axios";
import {get, omit} from "lodash";
import querystring from "querystring";
import {BaseLogClient} from "./BaseLogClient";

export interface HttpClientOptions extends AxiosRequestConfig, Record<string, unknown> {
  type?: Type<any>;
  collectionType?: Type<any>;
  additionalProperties?: boolean;
  withHeaders?: boolean;
}

@Injectable()
export class HttpClient extends BaseLogClient {
  @Inject()
  protected mapper: ConverterService;

  static getParamsSerializer(params: any) {
    return querystring.stringify(cleanObject(params));
  }

  async head<T = Record<string, any>>(endpoint: string, options: HttpClientOptions = {}): Promise<T> {
    const {headers} = await axios(this.getOptions("HEAD", endpoint, options));

    return headers;
  }

  async get<T = unknown>(endpoint: string, options: HttpClientOptions = {}): Promise<T> {
    const result = await this.send(this.getOptions("GET", endpoint, options));

    return this.mapResponse(result, options);
  }

  async post<T = unknown>(endpoint: string, options: HttpClientOptions = {}): Promise<T> {
    const result = await this.send(this.getOptions("POST", endpoint, options));

    return this.mapResponse(result, options);
  }

  async put<T = any>(endpoint: string, options: HttpClientOptions = {}): Promise<T> {
    const result = await this.send(this.getOptions("PUT", endpoint, options));

    return this.mapResponse(result, options);
  }

  async patch<T = any>(endpoint: string, options: HttpClientOptions = {}): Promise<T> {
    const result = await this.send(this.getOptions("PATCH", endpoint, options));

    return this.mapResponse(result, options);
  }

  async delete<T = any>(endpoint: string, options: HttpClientOptions = {}): Promise<T> {
    const result = await this.send(this.getOptions("DELETE", endpoint, options));

    return this.mapResponse(result, options);
  }

  protected async send(options: AxiosRequestConfig) {
    const startTime = new Date().getTime();

    try {
      const response = await axios({
        paramsSerializer: HttpClient.getParamsSerializer,
        ...options
      });

      this.onSuccess({startTime, ...options});

      return response;
    } catch (error) {
      this.onError(error, {startTime, ...options});
      this.throwException(error);
    }
  }

  protected throwException(error: Error) {
    const exception = new Exception(this.getStatusCodeFromError(error), get(error, "response.statusText"), get(error, "response", error));

    exception.headers = this.getHeadersFromError(error);

    throw exception;
  }

  protected getOptions(method: Method, endpoint: string, options: HttpClientOptions) {
    return {
      method,
      url: endpoint,
      ...omit(options, ["type", "collectionType", "additionalProperties"]),
      params: this.mapper.serialize(options.params),
      data: this.mapper.serialize(options.data),
      headers: cleanObject({
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options.headers || {})
      })
    };
  }

  protected mapResponse(result: any, options: HttpClientOptions) {
    const {type, collectionType, withHeaders, additionalProperties = false} = options;

    let data = !withHeaders ? result.data : result;

    data = this.mapper.deserialize(data, {
      collectionType,
      type,
      useAlias: true,
      additionalProperties
    });

    return withHeaders ? {data, headers: result.headers} : data;
  }
}
