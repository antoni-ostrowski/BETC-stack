import { Effect } from "effect"
import { Doc, Id } from "../_generated/dataModel"
import { DatabaseReader, DatabaseWriter } from "../_generated/server"
import { DatabaseError, NotFound } from "../utils"

export class TodoApi extends Effect.Service<TodoApi>()("TodoApi", {
  effect: Effect.gen(function* () {
    return {
      listTodos: Effect.fn(function* (db: DatabaseReader) {
        const todos = yield* Effect.tryPromise({
          try: async () => await db.query("todos").collect(),
          catch: () => new DatabaseError({ message: "Failed to fetch todos" }),
        })
        return todos
      }),

      getTodo: Effect.fn(function* (db: DatabaseReader, todoId: Id<"todos">) {
        const todo = yield* Effect.tryPromise({
          try: async () => await db.get(todoId),
          catch: () => new DatabaseError({ message: "Failed to get todo" }),
        })

        if (!todo) return yield* new NotFound({ message: "Todo not found" })

        return todo
      }),

      toggleTodo: Effect.fn(function* (db: DatabaseWriter, todo: Doc<"todos">) {
        yield* Effect.tryPromise({
          try: async () =>
            await db.patch(todo._id, { completed: !todo.completed }),
          catch: () => new DatabaseError({ message: "Failed to update todo" }),
        })
      }),
    }
  }),
}) {}
