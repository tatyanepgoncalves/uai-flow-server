import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
  dialect: 'postgresql',
  out: './src/db/migrations/',
  schema: './src/db/schema/*.ts',
})
