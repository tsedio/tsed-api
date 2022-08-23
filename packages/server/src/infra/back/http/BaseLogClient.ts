// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {Opts, PlatformContext} from "@tsed/common";
import {InjectContext} from "@tsed/di";
import {get} from "lodash";
import querystring from "querystring";
import {logToCurl} from "./logToCurl";

export interface BaseLogClientOptions {
  callee: string;
}

export class BaseLogClient {
  @InjectContext()
  $ctx?: PlatformContext;
  callee: string;

  constructor(@Opts options: Partial<BaseLogClientOptions> = {}) {
    this.callee = options.callee || "http";
  }

  protected onSuccess(options: Record<string, unknown>) {
    return this.$ctx?.logger.info({
      ...this.formatLog(options),
      status: "OK"
    });
  }

  protected onError(error: any, options: any) {
    const origin = this.errorMapper(error);
    this.$ctx?.logger.warn({
      ...this.formatLog(options),
      status: "KO",
      callee_code: origin.code,
      callee_error: origin.message,
      callee_request_qs: options.params && querystring.stringify(options.params),
      callee_request_headers: options.headers,
      callee_request_body: options.body && JSON.stringify(options.body),
      callee_response_headers: origin.headers,
      callee_response_body: origin.body && JSON.stringify(origin.body),
      callee_response_request_id: origin.x_request_id,
      curl: logToCurl(options)
    });
  }

  protected getStatusCodeFromError(error: any) {
    return get(error, "response.status", get(error, "response.statusCode", get(error, "status")));
  }

  protected getHeadersFromError(error: any) {
    return get(error, "response.headers", get(error, "headers"));
  }

  protected getResponseBodyFromError(error: any) {
    return get(error, "response.data", get(error, "data"));
  }

  protected formatLog(options: Record<string, any>) {
    const {startTime, url, method} = options;
    const {callee} = this;
    const duration = new Date().getTime() - startTime;

    return {
      callee,
      url,
      method,
      callee_qs: options.params && querystring.stringify(options.params),
      request_id: this.$ctx && this.$ctx.id,
      duration: isNaN(duration) ? undefined : duration
    };
  }

  protected errorMapper(error: Error) {
    const statusCode = this.getStatusCodeFromError(error);
    const headers = this.getHeadersFromError(error);
    const body = this.getResponseBodyFromError(error);

    return {
      message: error.message || statusCode,
      code: statusCode,
      headers,
      body,
      x_request_id: get(error, "response.headers.x-request-id", get(error, "headers.x-request-id"))
    };
  }
}
