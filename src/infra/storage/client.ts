import { S3Client } from '@aws-sdk/client-s3'
import { env } from '../env'

export const r2 = new S3Client({
  endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  region: 'auto',
  credentials: {
    accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
  },
})
