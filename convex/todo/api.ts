import { Effect, flow } from "effect"
import { Doc, Id } from "../_generated/dataModel"
import { DatabaseReader, DatabaseWriter } from "../_generated/server"
import { DatabaseError, NotFound } from "../utils_effect"

// this is just an example structure that I think works nicely, its a simple repo pattern
// for data aceess layer
export class TodoApi extends Effect.Service<TodoApi>()("TodoApi", {
  effect: Effect.gen(function* () {
    return {
      listTodos: flow(
        (args: { db: DatabaseReader }) => args,
        ({ db }) =>
          Effect.tryPromise({
            try: async () => await db.query("todos").collect(),
            catch: () => new DatabaseError({ message: "Failed to fetch todos" })
          }),
        Effect.tapError((err) => Effect.logError(err))
      ),

      getTodo: flow(
        (args: { db: DatabaseReader; todoId: Id<"todos"> }) => args,
        ({ db, todoId }) =>
          Effect.tryPromise({
            try: async () => await db.get("todos", todoId),
            catch: () => new DatabaseError({ message: "Failed to get todo" })
          }),
        Effect.filterOrFail(
          (a) => a != null,
          () => new NotFound()
        ),
        Effect.tapError((err) => Effect.logError(err))
      ),

      toggleTodo: flow(
        (args: { db: DatabaseWriter; todo: Doc<"todos"> }) => args,
        ({ db, todo }) =>
          Effect.tryPromise({
            try: async () => {
              await db.patch(todo._id, { completed: !todo.completed })
            },
            catch: () => new DatabaseError({ message: "Failed to update todo" })
          }),
        Effect.tapError((err) => Effect.logError(err))
      ),

      create: flow(
        (args: { db: DatabaseWriter; text: string; userId: Id<"users"> }) =>
          args,
        ({ db, text, userId }) =>
          Effect.tryPromise({
            try: async () =>
              await db.insert("todos", {
                text,
                completed: true,
                userId
              }),
            catch: (cause) =>
              new DatabaseError({ message: "Failed to create todo", cause })
          }),
        Effect.tapError((err) => Effect.logError(err))
      ),
      remove: flow(
        (args: { db: DatabaseWriter; todoId: Id<"todos"> }) => args,
        ({ db, todoId }) =>
          Effect.tryPromise({
            try: async () => await db.delete(todoId),
            catch: (cause) =>
              new DatabaseError({ message: "Failed to remove todo", cause })
          }),
        Effect.tapError((err) => Effect.logError(err))
      )
    }
  })
}) {}
