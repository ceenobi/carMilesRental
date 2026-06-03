import { config } from 'dotenv'

// Load .env first
if (!process.env.VERCEL) {
  if (process.env.NODE_ENV !== 'production') {
    config()
  }
}

interface EnvSpec {
  key: string
  required?: boolean
}

const ENV_VARS: EnvSpec[] = [
  { key: 'NODE_ENV', required: true },
  { key: 'DATABASE_URL', required: true },
  { key: 'DATABASE_NAME', required: true },
  { key: 'CLIENT_URL', required: true },
  { key: 'SERVER_URL', required: true },
  { key: 'SESSION_SECRET', required: true },
  { key: 'LOG_LEVEL', required: false },
  { key: 'SESSION_MAX_AGE', required: false },
  { key: 'BREVO_API_KEY', required: true },
  { key: 'EMAIL_OWNER', required: false },
  { key: 'CLOUDINARY_CLOUD_NAME', required: true },
  { key: 'CLOUDINARY_API_KEY', required: true },
  { key: 'CLOUDINARY_SECRET_KEY', required: true },
  { key: 'CLOUDINARY_UPLOAD_PRESET', required: true },
  { key: 'PAYSTACK_SECRET_KEY', required: true },
]

interface Env {
  readonly [key: string]: string
}

// Define env before validation
const env: Env = process.env as Env

const requiredVars = ENV_VARS.filter(v => v.required)
const missingVars = requiredVars.filter(v => !env[v.key])

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.map(v => v.key).join(', ')}`)
}

export { env }
