// src/schemas/PostSchema.js

const PostSchema = {
  type: 'object',
  required: ['id', 'title', 'body', 'userId'],
  properties: {
    id:     { type: 'integer' },
    userId: { type: 'integer' },
    title:  { type: 'string', minLength: 1 },
    body:   { type: 'string', minLength: 1 },
  },
  additionalProperties: true,
};

const PostListSchema = {
  type:     'array',
  items:    PostSchema,
  minItems: 1,
};

module.exports = { PostSchema, PostListSchema };
