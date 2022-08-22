import {isProduction} from "../env";
import {$log} from "@tsed/common";

$log.name = process.env.LOG_NAME || "API";

export const loggerConfig = {
  level: (process.env.LOG_LEVEL || "info") as any,
  disableRoutesSummary: isProduction
};

if (isProduction) {
  $log.appenders.set("stdout", {
    type: "stdout",
    levels: ["info", "debug"],
    layout: {
      type: "json"
    }
  });

  $log.appenders.set("stderr", {
    levels: ["trace", "fatal", "error", "warn"],
    type: "stderr",
    layout: {
      type: "json"
    }
  });
}
