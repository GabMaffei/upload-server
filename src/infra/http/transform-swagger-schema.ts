import { jsonSchemaTransform } from 'fastify-type-provider-zod'

type transformSwaggerSchemaData = Parameters<typeof jsonSchemaTransform>[0]

type JsonSchemaProperty = {
  type: string
  format: string
}

type JsonSchemaObjectBody = {
  type: 'object'
  required: string[]
  properties: Record<string, JsonSchemaProperty>
}

export function transformSwaggerSchema(data: transformSwaggerSchemaData) {
  const { schema, url } = jsonSchemaTransform(data)

  if (schema.consumes?.includes('multipart/form-data')) {
    if (typeof schema.body !== 'object' || schema.body === null) {
      schema.body = {
        type: 'object',
        required: [],
        properties: {},
      } as JsonSchemaObjectBody
    }

    const body = schema.body as JsonSchemaObjectBody

    body.properties.file = {
      type: 'string',
      format: 'binary',
    }

    body.required.push('file')
  }

  return { schema, url }
}
