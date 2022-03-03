import {$log} from "@tsed/common";
import redisStore from "cache-manager-ioredis";

function clusterRetryStrategy(times: number) {
  $log.fatal({event: "REDIS_ERROR", message: `Redis is not responding - Retry count: ${times}`});
  return 2000;
}

function reconnectOnError(err: any) {
  $log.fatal({event: "REDIS_ERROR", message: `Redis - Reconnect on error: ${(err && err.message) || err}`});
}

function redisOptions(opts: any = {}) {
  return {
    reconnectOnError,
    noDelay: opts.noDelay || true,
    connectTimeout: opts.connectTimeout || 15000,
    autoResendUnfulfilledCommands: opts.autoResendUnfulfilledCommands || true,
    maxRetriesPerRequest: opts.maxRetriesPerRequest || 5,
    enableAutoPipelining: true,
    autoPipeliningIgnoredCommands: ["scan"]
  };
}

function getClusterConfig(_nodes: string, _opts: string | undefined) {
  const nodes = JSON.parse(_nodes);
  const opts = _opts ? JSON.parse(_opts) : {};

  const options = {
    scaleReads: opts.scaleReads || "all",
    maxRedirections: opts.maxRedirections || 16,
    retryDelayOnTryAgain: opts.retryDelayOnTryAgain || 100,
    retryDelayOnFailover: opts.retryDelayOnFailover || 200,
    retryDelayOnClusterDown: opts.retryDelayOnClusterDown || 1000,
    slotsRefreshTimeout: opts.slotsRefreshTimeout || 15000,
    slotsRefreshInterval: opts.slotsRefreshInterval || 20000,
    clusterRetryStrategy,
    enableOfflineQueue: opts.enableOfflineQueue || true,
    enableReadyCheck: opts.enableReadyCheck || true,
    redisOptions: redisOptions(opts)
  };

  $log.info({
    event: "REDIS_CONFIG",
    nodes,
    options
  });

  return {
    nodes,
    options
  };
}

function getConfiguration() {
  if (process.env.REDIS_NODES) {
    return {
      clusterConfig: getClusterConfig(process.env.REDIS_NODES, process.env.REDIS_OPTS)
    };
  }

  if (process.env.REDIS_URL) {
    const url = new URL(process.env.REDIS_URL);

    return {
      host: url.hostname,
      password: url.password,
      port: url.port,
      username: url.username,
      tls: url.protocol === "rediss:" ? {rejectUnauthorized: false} : false,
      db: process.env.REDIS_DB_INDEX || 0,
      ...redisOptions()
    };
  }

  return {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB_INDEX || 0,
    ...redisOptions()
  };
}

export const cacheConfig = {
  ttl: 300,
  store: redisStore as any,
  ...getConfiguration()
};
