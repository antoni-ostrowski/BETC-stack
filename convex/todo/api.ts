import { Effect, flow } from "effect"
import { Doc, Id } from "../_generated/dataModel"
import { DatabaseReader, DatabaseWriter } from "../_generated/server"
import { DatabaseError, NotFound } from "../utils_effect"

export class TodoApi extends Effect.Service<TodoApi>()("TodoApi", {
  effect: Effect.gen(function* () {
    return {
      listTodos: flow(
        (args: { db: DatabaseReader }) => args,
        ({ db }) =>
          Effect.tryPromise({
            try: async () => await db.query("todos").collect(),
            catch: () => new DatabaseError({ message: "Failed to fetch todos" })
          })
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
          () => new NotFound({})
        )
      ),

      toggleTodo: flow(
        (args: { db: DatabaseWriter; todo: Doc<"todos"> }) => args,
        ({ db, todo }) =>
          Effect.tryPromise({
            try: async () =>
              await db.patch(todo._id, { completed: !todo.completed }),
            catch: () => new DatabaseError({ message: "Failed to update todo" })
          })
      )
    }
  })
}) {}
