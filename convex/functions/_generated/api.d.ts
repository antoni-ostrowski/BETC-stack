/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type { FunctionReference } from "convex/server";
import type { GenericId as Id } from "convex/values";

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: {
  organization: {
    list: FunctionReference<
      "query",
      "public",
      {},
      {
        organizations: Array<{
          id: Id<"organization">;
          isPersonal: boolean;
          logo?: string | null;
          name: string;
          slug: string;
        }>;
      }
    >;
  };
  polarSubscription: {
    cancelSubscription: FunctionReference<
      "action",
      "public",
      {},
      { success: boolean }
    >;
    resumeSubscription: FunctionReference<
      "action",
      "public",
      {},
      { success: boolean }
    >;
  };
  todo: {
    m: {
      create: FunctionReference<"mutation", "public", { text: string }, any>;
      remove: FunctionReference<
        "mutation",
        "public",
        { todoId: Id<"todo"> },
        any
      >;
      toggle: FunctionReference<"mutation", "public", { id: Id<"todo"> }, any>;
    };
    q: {
      list: FunctionReference<
        "query",
        "public",
        {},
        Array<{
          _creationTime: number;
          _id: Id<"todo">;
          completed: boolean;
          text: string;
          userId: Id<"user">;
        }>
      >;
    };
  };
};

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: {
  auth: {
    beforeCreate: FunctionReference<
      "mutation",
      "internal",
      { data: any; model: string },
      any
    >;
    beforeDelete: FunctionReference<
      "mutation",
      "internal",
      { doc: any; model: string },
      any
    >;
    beforeUpdate: FunctionReference<
      "mutation",
      "internal",
      { doc: any; model: string; update: any },
      any
    >;
    create: FunctionReference<
      "mutation",
      "internal",
      {
        beforeCreateHandle?: string;
        input: { data: any; model: string };
        onCreateHandle?: string;
        select?: Array<string>;
      },
      any
    >;
    deleteMany: FunctionReference<
      "mutation",
      "internal",
      {
        beforeDeleteHandle?: string;
        input: { model: string; where?: Array<any> };
        onDeleteHandle?: string;
        paginationOpts: {
          cursor: string | null;
          endCursor?: string | null;
          id?: number;
          maximumBytesRead?: number;
          maximumRowsRead?: number;
          numItems: number;
        };
      },
      any
    >;
    deleteOne: FunctionReference<
      "mutation",
      "internal",
      {
        beforeDeleteHandle?: string;
        input: { model: string; where?: Array<any> };
        onDeleteHandle?: string;
      },
      any
    >;
    findMany: FunctionReference<
      "query",
      "internal",
      {
        join?: any;
        limit?: number;
        model: string;
        offset?: number;
        paginationOpts: {
          cursor: string | null;
          endCursor?: string | null;
          id?: number;
          maximumBytesRead?: number;
          maximumRowsRead?: number;
          numItems: number;
        };
        sortBy?: { direction: "asc" | "desc"; field: string };
        where?: Array<{
          connector?: "AND" | "OR";
          field: string;
          operator?:
            | "lt"
            | "lte"
            | "gt"
            | "gte"
            | "eq"
            | "in"
            | "not_in"
            | "ne"
            | "contains"
            | "starts_with"
            | "ends_with";
          value:
            | string
            | number
            | boolean
            | Array<string>
            | Array<number>
            | null;
        }>;
      },
      any
    >;
    findOne: FunctionReference<
      "query",
      "internal",
      {
        join?: any;
        model: string;
        select?: Array<string>;
        where?: Array<{
          connector?: "AND" | "OR";
          field: string;
          operator?:
            | "lt"
            | "lte"
            | "gt"
            | "gte"
            | "eq"
            | "in"
            | "not_in"
            | "ne"
            | "contains"
            | "starts_with"
            | "ends_with";
          value:
            | string
            | number
            | boolean
            | Array<string>
            | Array<number>
            | null;
        }>;
      },
      any
    >;
    getLatestJwks: FunctionReference<"action", "internal", {}, any>;
    onCreate: FunctionReference<
      "mutation",
      "internal",
      { doc: any; model: string },
      any
    >;
    onDelete: FunctionReference<
      "mutation",
      "internal",
      { doc: any; model: string },
      any
    >;
    onUpdate: FunctionReference<
      "mutation",
      "internal",
      { model: string; newDoc: any; oldDoc: any },
      any
    >;
    rotateKeys: FunctionReference<"action", "internal", {}, any>;
    updateMany: FunctionReference<
      "mutation",
      "internal",
      {
        beforeUpdateHandle?: string;
        input: { model: string; update: any; where?: Array<any> };
        onUpdateHandle?: string;
        paginationOpts: {
          cursor: string | null;
          endCursor?: string | null;
          id?: number;
          maximumBytesRead?: number;
          maximumRowsRead?: number;
          numItems: number;
        };
      },
      any
    >;
    updateOne: FunctionReference<
      "mutation",
      "internal",
      {
        beforeUpdateHandle?: string;
        input: { model: string; update: any; where?: Array<any> };
        onUpdateHandle?: string;
      },
      any
    >;
  };
  polarCustomer: {
    createCustomer: FunctionReference<
      "action",
      "internal",
      { email: string; name?: string; userId: Id<"user"> },
      null
    >;
    updateUserPolarCustomerId: FunctionReference<
      "mutation",
      "internal",
      { customerId: string; userId: Id<"user"> },
      null
    >;
  };
  polarSubscription: {
    createSubscription: FunctionReference<
      "mutation",
      "internal",
      {
        subscription: {
          amount?: number | null;
          cancelAtPeriodEnd: boolean;
          checkoutId?: string | null;
          createdAt: string;
          currency?: string | null;
          currentPeriodEnd?: string | null;
          currentPeriodStart: string;
          customerCancellationComment?: string | null;
          customerCancellationReason?: string | null;
          endedAt?: string | null;
          metadata: Record<string, any>;
          modifiedAt?: string | null;
          organizationId: Id<"organization">;
          priceId?: string;
          productId: string;
          recurringInterval?: string | null;
          startedAt?: string | null;
          status: string;
          subscriptionId: string;
          userId: Id<"user">;
        };
      },
      null
    >;
    getActiveSubscription: FunctionReference<
      "query",
      "internal",
      { userId: Id<"user"> },
      { subscriptionId: string } | null
    >;
    updateSubscription: FunctionReference<
      "mutation",
      "internal",
      {
        subscription: {
          _creationTime: number;
          _id: Id<"subscriptions">;
          amount?: number | null;
          cancelAtPeriodEnd: boolean;
          checkoutId?: string | null;
          createdAt: string;
          currency?: string | null;
          currentPeriodEnd?: string | null;
          currentPeriodStart: string;
          customerCancellationComment?: string | null;
          customerCancellationReason?: string | null;
          endedAt?: string | null;
          metadata: Record<string, any>;
          modifiedAt?: string | null;
          organizationId: Id<"organization">;
          priceId?: string;
          productId: string;
          recurringInterval?: string | null;
          startedAt?: string | null;
          status: string;
          subscriptionId: string;
          userId: Id<"user">;
        };
      },
      { updated: boolean }
    >;
  };
};

export declare const components: {};
