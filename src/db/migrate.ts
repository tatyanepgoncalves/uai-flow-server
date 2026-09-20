import 'dotenv/config'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import postgres from 'postgres'

const __dirname = dirname(fileURLToPath(import.meta.url))

const MIGRATION_FILE = '0002_reflective_gorgon.sql'

async function main() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error('DATABASE_URL is not set in the environment.')
    process.exit(1)
  }

  const migrationPath = join(__dirname, 'migrations', MIGRATION_FILE)
  const sql = readFileSync(migrationPath, 'utf-8')

  const client = postgres(databaseUrl, { max: 1 })

  try {
    // Drizzle uses `--> statement-breakpoint` to separate statements
    // that must be run individually.
    const statements = sql
      .split('--> statement-breakpoint')
      .map((statement) => statement.trim())
      .filter(Boolean)

    for (const statement of statements) {
      await client.unsafe(statement)
    }

    console.log(`Migration "${MIGRATION_FILE}" applied successfully.`)
  } catch (error) {
    console.error(`Failed to apply migration "${MIGRATION_FILE}":`, error)
    process.exitCode = 1
  } finally {
    await client.end()
  }
}

main()
