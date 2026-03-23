// src/schemas/UserSchema.js

// JSON Schema used to validate the shape of API responses.
// AssertionHelper.matchesSchema(body, UserSchema) checks every field.

const UserSchema = {
  type: 'object',
  required: ['id', 'name', 'email'],
  properties: {
    id:       { type: 'integer' },
    name:     { type: 'string', minLength: 1 },
    email:    { type: 'string', format: 'email' },
    username: { type: 'string' },
    phone:    { type: 'string' },
    website:  { type: 'string' },
  },
  additionalProperties: true,
};

const UserListSchema = {
  type:     'array',
  items:    UserSchema,
  minItems: 1,
};

module.exports = { UserSchema, UserListSchema };
