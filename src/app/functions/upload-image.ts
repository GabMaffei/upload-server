import { Readable } from 'node:stream'
import { z } from 'zod'

const uploadImageInput = z.object({
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable),
})

type uploadImageInput = z.input<typeof uploadImageInput>

export async function uploadImage(input: uploadImageInput) {
  const { fileName, contentType, contentStream } = uploadImageInput.parse(input)
}
