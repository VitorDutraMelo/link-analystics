import { env } from '../config/env.js';
const error = {
  type: 'object',
  properties: {
    error: {
      type: 'object',
      properties: { code: { type: 'string' }, message: { type: 'string' } },
    },
  },
};
export const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'Link Analytics API',
    version: '1.0.0',
    description: 'URL shortening, redirection and first-party click analytics API.',
  },
  servers: [{ url: env.APP_URL }],
  tags: [{ name: 'Auth' }, { name: 'Links' }, { name: 'Analytics' }, { name: 'System' }],
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    schemas: {
      Error: error,
      Register: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Vitor Melo' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', format: 'password', example: 'Backend123' },
        },
      },
      Login: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', format: 'password' },
        },
      },
      CreateLink: {
        type: 'object',
        required: ['url'],
        properties: {
          url: { type: 'string', format: 'uri', example: 'https://example.com/article' },
        },
      },
    },
  },
  paths: {
    '/api/health': {
      get: {
        tags: ['System'],
        summary: 'Service health',
        responses: { '200': { description: 'Healthy' } },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a user',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Register' } } },
        },
        responses: {
          '201': { description: 'Created' },
          '409': {
            description: 'Email in use',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
          },
          '422': { description: 'Invalid input' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Authenticate and receive JWT',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Login' } } },
        },
        responses: {
          '200': { description: 'Authenticated' },
          '401': { description: 'Invalid credentials' },
        },
      },
    },
    '/api/links': {
      get: {
        tags: ['Links'],
        summary: 'List own links',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 20, maximum: 100 } },
        ],
        responses: {
          '200': { description: 'Paginated links' },
          '401': { description: 'Unauthorized' },
        },
      },
      post: {
        tags: ['Links'],
        summary: 'Create short link',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateLink' } } },
        },
        responses: {
          '201': { description: 'Link created' },
          '422': { description: 'Invalid URL' },
        },
      },
    },
    '/api/links/{id}': {
      get: {
        tags: ['Links'],
        summary: 'Get own link',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Link' }, '404': { description: 'Not found' } },
      },
      delete: {
        tags: ['Links'],
        summary: 'Delete own link',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'Deleted' }, '404': { description: 'Not found' } },
      },
    },
    '/api/links/{id}/analytics': {
      get: {
        tags: ['Analytics'],
        summary: 'Analytics for an owned link',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Aggregated real click data' },
          '404': { description: 'Not found or not owned' },
        },
      },
    },
    '/{code}': {
      get: {
        tags: ['Links'],
        summary: 'Record click and redirect',
        parameters: [{ in: 'path', name: 'code', required: true, schema: { type: 'string' } }],
        responses: {
          '302': { description: 'Redirect to original URL' },
          '404': { description: 'Code not found' },
        },
      },
    },
  },
};
