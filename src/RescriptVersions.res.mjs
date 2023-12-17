// Generated by ReScript, PLEASE EDIT WITH CARE

import * as $$Node from "./bindings/Node.res.mjs";
import * as Core__Array from "@rescript/core/src/Core__Array.res.mjs";
import * as ClackPrompts from "./bindings/ClackPrompts.res.mjs";
import * as Prompts from "@clack/prompts";
import * as PackageManagers from "./PackageManagers.res.mjs";
import * as CompareVersions from "compare-versions";

async function getPackageVersions(packageName, range) {
  var match = await $$Node.Promisified.ChildProcess.exec("npm view " + packageName + " versions --json");
  var versions = JSON.parse(match.stdout);
  var versions$1;
  versions$1 = !Array.isArray(versions) && (versions === null || typeof versions !== "object") && typeof versions !== "number" && typeof versions !== "string" && typeof versions !== "boolean" ? [] : (
      Array.isArray(versions) ? Core__Array.filterMap(versions, (function (json) {
                if (!Array.isArray(json) && (json === null || typeof json !== "object") && typeof json !== "number" && typeof json !== "string" && typeof json !== "boolean" || !(typeof json === "string" && CompareVersions.satisfies(json, range))) {
                  return ;
                } else {
                  return json;
                }
              })) : []
    );
  versions$1.reverse();
  return versions$1;
}

async function promptVersions() {
  var s = Prompts.spinner();
  s.start("Loading available versions...");
  var match = await Promise.all([
        getPackageVersions("rescript", "~11 >=11.0.0-rc.6"),
        getPackageVersions("@rescript/core", ">=0.5.0")
      ]);
  s.stop("Versions loaded.");
  var rescriptVersion = await ClackPrompts.resultOrRaise(Prompts.select({
            message: "ReScript version?",
            options: match[0].map(function (v) {
                  return {
                          value: v
                        };
                })
          }));
  var rescriptCoreVersion = await ClackPrompts.resultOrRaise(Prompts.select({
            message: "ReScript Core version?",
            options: match[1].map(function (v) {
                  return {
                          value: v
                        };
                })
          }));
  return {
          rescriptVersion: rescriptVersion,
          rescriptCoreVersion: rescriptCoreVersion
        };
}

async function installVersions(param) {
  var packageManager = PackageManagers.getActivePackageManager();
  var packages = [
    "rescript@" + param.rescriptVersion,
    "@rescript/core@" + param.rescriptCoreVersion
  ];
  var command = packageManager + " add " + packages.join(" ");
  await $$Node.Promisified.ChildProcess.exec(command);
}

export {
  promptVersions ,
  installVersions ,
}
/* Node Not a pure module */