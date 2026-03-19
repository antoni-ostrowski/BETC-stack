import { Option, Schema } from "effect"

export class ServerError extends Schema.TaggedErrorClass("ServerError")("ServerError", {
  cause: Schema.Unknown.pipe(Schema.optional),
  message: Schema.String.pipe(
    Schema.optional,
    Schema.withConstructorDefault(() => Option.some("internal server error: unspecified error"))
  )
}) {}

export class DatabaseError extends Schema.TaggedErrorClass("DatabaseError")("DatabaseError", {
  cause: Schema.Unknown.pipe(Schema.optional),
  message: Schema.String.pipe(
    Schema.optional,
    Schema.withConstructorDefault(() => Option.some("internal server error: database error"))
  )
}) {}

export class NotFound extends Schema.TaggedErrorClass("NotFound")("NotFound", {
  cause: Schema.Unknown.pipe(Schema.optional),
  message: Schema.String.pipe(
    Schema.optional,
    Schema.withConstructorDefault(() => Option.some("resource not found"))
  )
}) {}

export class Unauthenticated extends Schema.TaggedErrorClass("Unauthenticated")("Unauthenticated", {
  cause: Schema.Unknown.pipe(Schema.optional),
  message: Schema.String.pipe(
    Schema.optional,
    Schema.withConstructorDefault(() => Option.some("failed to authenticate"))
  )
}) {}
