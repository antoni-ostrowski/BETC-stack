import { authQuery } from "./lib"

export const list = authQuery({
  args: {},
  handler: async (ctx) => {
    console.log(ctx.auth.user)
    return await ctx.db.query("todos").collect()
  },
})

// export const add = mutation({
//   args: { text: v.string() },
//   handler: async (ctx, args) => {
//     return await ctx.db.insert("todos", {
//       text: args.text,
//       completed: false,
//     })
//   },
// })

// export const toggle = mutation({
//   args: { id: v.id("todos") },
//   handler: async (ctx, args) => {
//     const todo = await ctx.db.get(args.id)
//     if (!todo) {
//       throw new Error("Todo not found")
//     }
//     return await ctx.db.patch(args.id, {
//       completed: !todo.completed,
//     })
//   },
// })
//
// export const remove = mutation({
//   args: { id: v.id("todos") },
//   handler: async (ctx, args) => {
//     return await ctx.db.delete(args.id)
//   },
// })
