/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as authSchema from "../authSchema.js";
import type * as generated_auth from "../generated/auth.js";
import type * as generated_server from "../generated/server.js";
import type * as http from "../http.js";
import type * as lib from "../lib.js";
import type * as org_mutations from "../org/mutations.js";
import type * as org_queries from "../org/queries.js";
import type * as runtime from "../runtime.js";
import type * as todo_mutations from "../todo/mutations.js";
import type * as todo_queries from "../todo/queries.js";
import type * as user_queries from "../user/queries.js";
import type * as utils_effect from "../utils_effect.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  authSchema: typeof authSchema;
  "generated/auth": typeof generated_auth;
  "generated/server": typeof generated_server;
  http: typeof http;
  lib: typeof lib;
  "org/mutations": typeof org_mutations;
  "org/queries": typeof org_queries;
  runtime: typeof runtime;
  "todo/mutations": typeof todo_mutations;
  "todo/queries": typeof todo_queries;
  "user/queries": typeof user_queries;
  utils_effect: typeof utils_effect;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
