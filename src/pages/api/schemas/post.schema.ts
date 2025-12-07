import Ajv from 'ajv';

const ajv = new Ajv();

export const PostSchema = {
  type: 'object',
  properties: {
    userId: { type: 'number' },
    id: { type: 'number' },
    title: { type: 'string' },
    body: { type: 'string' },
  },
  required: ['userId', 'id', 'title', 'body'],
  additionalProperties: false,
};

export const CreatePostSchema = {
  type: 'object',
  properties: {
    userId: { type: 'number' },
    title: { type: 'string' },
    body: { type: 'string' },
  },
  required: ['userId', 'title', 'body'],
  additionalProperties: false,
};

export const validatePost = ajv.compile(PostSchema);
export const validateCreatePost = ajv.compile(CreatePostSchema);