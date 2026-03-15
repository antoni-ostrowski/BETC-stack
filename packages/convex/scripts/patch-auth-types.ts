#!/usr/bin/env bun
/**
 * Patch script for better-convex generated auth.ts
 * Fixes circular type inference issue by adding explicit type annotations
 */

import { readFileSync, writeFileSync } from "fs"
import { resolve } from "path"

const AUTH_FILE_PATH = resolve(
  __dirname,
  "../convex/functions/generated/auth.ts"
)

function patchAuthTypes(): void {
  console.log("🔧 Patching auth.ts types...")

  let content: string
  try {
    content = readFileSync(AUTH_FILE_PATH, "utf-8")
  } catch (error) {
    console.error("❌ Failed to read auth.ts:", error)
    process.exit(1)
  }

  // Check if already patched
  if (content.includes("AuthRuntimeType")) {
    console.log("✅ Auth types already patched, skipping...")
    process.exit(0)
  }

  // Find the AuthDefinitionFromFile type and add our new types after it
  const authDefinitionMatch =
    /type AuthDefinitionFromFile = Extract<[\s\S]*?>[\s\S]*?>\n/.exec(content)

  if (!authDefinitionMatch) {
    console.error(
      "❌ Could not find AuthDefinitionFromFile type. File structure may have changed."
    )
    process.exit(1)
  }

  const insertPosition = authDefinitionMatch.index + authDefinitionMatch[0].length

  // New types to insert
  const newTypes = `
type AuthOptionsFromFile = ReturnType<AuthDefinitionFromFile>;

type AuthRuntimeType = ReturnType<typeof createAuthRuntime<
  DataModel,
  typeof schema,
  MutationCtx,
  GenericCtx,
  AuthOptionsFromFile
>>;
`

  // Insert the new types
  content = content.slice(0, insertPosition) + newTypes + content.slice(insertPosition)

  // Replace: const authRuntime = createAuthRuntime<...>({
  // With: const authRuntime: AuthRuntimeType = createAuthRuntime<...>({
  content = content.replace(
    /const authRuntime = createAuthRuntime</,
    "const authRuntime: AuthRuntimeType = createAuthRuntime<"
  )

  // Replace: ReturnType<AuthDefinitionFromFile> in the generic params
  // With: AuthOptionsFromFile
  content = content.replace(
    /createAuthRuntime<\s*DataModel,\s*typeof schema,\s*MutationCtx,\s*GenericCtx,\s*ReturnType<AuthDefinitionFromFile>\s*>/,
    "createAuthRuntime<\n  DataModel,\n  typeof schema,\n  MutationCtx,\n  GenericCtx,\n  AuthOptionsFromFile\n>"
  )

  try {
    writeFileSync(AUTH_FILE_PATH, content, "utf-8")
    console.log("✅ Successfully patched auth.ts types!")
  } catch (error) {
    console.error("❌ Failed to write auth.ts:", error)
    process.exit(1)
  }
}

// Run the patch
patchAuthTypes()
