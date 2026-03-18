import { Data } from "effect";

export class ServerError extends Data.TaggedError("ServerError")<{
  message?: string;
  cause?: unknown;
}> {
  constructor(args?: { message?: string; cause?: unknown }) {
    super({
      message: args?.message ?? "Server error",
      cause: args?.cause,
    });
  }
}

export class DatabaseError extends Data.TaggedError("DatabaseError")<{
  message?: string;
  cause?: unknown;
}> {
  constructor(args?: { message?: string; cause?: unknown }) {
    super({
      message: args?.message ?? "Database error",
      cause: args?.cause,
    });
  }
}

export class NotFound extends Data.TaggedError("NotFound")<{
  message?: string;
  cause?: unknown;
}> {
  constructor(args?: { message?: string; cause?: unknown }) {
    super({
      message: args?.message ?? "Entity not found",
      cause: args?.cause,
    });
  }
}

export class NotAuthenticated extends Data.TaggedError("NotAuthenticated")<{
  message?: string;
  cause?: unknown;
}> {
  constructor(args?: { message?: string; cause?: unknown }) {
    super({
      message: args?.message ?? "not authenticated",
      cause: args?.cause,
    });
  }
}
