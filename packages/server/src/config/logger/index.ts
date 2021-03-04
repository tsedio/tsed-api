import {isProduction} from "../env";
import {$log} from "@tsed/common";
import "@tsed/logger-logentries";

$log.name = process.env.LOG_NAME || "API";

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

if (process.env.LOG_ENTRIES_KEY) {
  $log.appenders
    .set("stdout", {
      type: "logentries",
      levels: ["info", "debug"],
      layout: {
        type: "json"
      },
      options: {
        token: process.env.LOG_ENTRIES_KEY
      }
    })
    .set("stderr", {
      levels: ["trace", "fatal", "error", "warn"],
      type: "logentries",
      layout: {
        type: "json"
      },
      options: {
        token: process.env.LOG_ENTRIES_KEY
      }
    });
}
