import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.3',

    info: {
      title: 'Nexora AI API',
      version: '1.0.0',
      description:
        'Industry-aware RAG knowledge platform API for Healthcare and Finance.'
    },

    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local development server'
      }
    ],

    tags: [
      {
        name: 'Health',
        description: 'API health'
      },
      {
        name: 'Industries',
        description: 'Healthcare and Finance configuration'
      },
      {
        name: 'Documents',
        description: 'Knowledge document management'
      },
      {
        name: 'Chat',
        description: 'RAG conversations'
      }
    ],

    components: {
      schemas: {

        Document: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '66c123456789abcdef123456'
            },

            name: {
              type: 'string',
              example: 'Hypertension Clinical Guidelines'
            },

            industry: {
              type: 'string',
              enum: ['healthcare', 'finance']
            },

            category: {
              type: 'string',
              example: 'Clinical Guidelines'
            },

            status: {
              type: 'string',
              enum: [
                'uploaded',
                'processing',
                'ready',
                'failed'
              ]
            },

            pages: {
              type: 'integer',
              example: 42
            },

            chunks: {
              type: 'integer',
              example: 128
            }
          }
        },

        Chat: {
          type: 'object',
          properties: {
            _id: {
              type: 'string'
            },

            title: {
              type: 'string',
              example: 'Hypertension research'
            },

            industry: {
              type: 'string',
              enum: ['healthcare', 'finance']
            },

            messages: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  role: {
                    type: 'string',
                    enum: ['user', 'assistant']
                  },

                  content: {
                    type: 'string'
                  }
                }
              }
            }
          }
        },

        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },

            message: {
              type: 'string',
              example: 'Document not found'
            }
          }
        }
      }
    },

    paths: {

      '/api/health': {
        get: {
          tags: ['Health'],
          summary: 'Check API health',

          responses: {
            200: {
              description: 'API is healthy'
            }
          }
        }
      },

      '/api/industries': {
        get: {
          tags: ['Industries'],
          summary: 'Get supported industries',

          responses: {
            200: {
              description: 'List of industries'
            }
          }
        }
      },

      '/api/industries/{id}': {
        get: {
          tags: ['Industries'],
          summary: 'Get industry configuration',

          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                enum: ['healthcare', 'finance']
              }
            }
          ],

          responses: {
            200: {
              description: 'Industry configuration'
            },

            404: {
              description: 'Industry not found'
            }
          }
        }
      },

      '/api/documents': {

        get: {
          tags: ['Documents'],
          summary: 'List knowledge documents',

          parameters: [
            {
              name: 'industry',
              in: 'query',
              schema: {
                type: 'string',
                enum: ['healthcare', 'finance']
              }
            },

            {
              name: 'category',
              in: 'query',
              schema: {
                type: 'string'
              }
            }
          ],

          responses: {
            200: {
              description: 'Documents retrieved'
            }
          }
        },

        post: {
          tags: ['Documents'],
          summary: 'Upload a PDF knowledge document',

          requestBody: {
            required: true,

            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  required: [
                    'file',
                    'industry',
                    'category'
                  ],

                  properties: {
                    file: {
                      type: 'string',
                      format: 'binary'
                    },

                    industry: {
                      type: 'string',
                      enum: ['healthcare', 'finance']
                    },

                    category: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          },

          responses: {
            201: {
              description: 'Document uploaded'
            },

            400: {
              description: 'Invalid request'
            }
          }
        }
      },

      '/api/documents/{id}': {

        get: {
          tags: ['Documents'],
          summary: 'Get a document',

          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string'
              }
            }
          ],

          responses: {
            200: {
              description: 'Document retrieved'
            },

            404: {
              description: 'Document not found'
            }
          }
        },

        delete: {
          tags: ['Documents'],
          summary: 'Delete a document',

          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string'
              }
            }
          ],

          responses: {
            200: {
              description: 'Document deleted'
            },

            404: {
              description: 'Document not found'
            }
          }
        }
      },

      '/api/chat': {

        get: {
          tags: ['Chat'],
          summary: 'Get chat conversations',

          parameters: [
            {
              name: 'industry',
              in: 'query',
              schema: {
                type: 'string',
                enum: ['healthcare', 'finance']
              }
            }
          ],

          responses: {
            200: {
              description: 'Chats retrieved'
            }
          }
        },

        post: {
          tags: ['Chat'],
          summary: 'Create a new conversation',

          requestBody: {
            required: true,

            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['industry'],

                  properties: {
                    industry: {
                      type: 'string',
                      enum: ['healthcare', 'finance']
                    },

                    title: {
                      type: 'string',
                      example: 'Financial risk analysis'
                    }
                  }
                }
              }
            }
          },

          responses: {
            201: {
              description: 'Chat created'
            }
          }
        }
      },

      '/api/chat/{id}': {

        get: {
          tags: ['Chat'],
          summary: 'Get a conversation',

          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string'
              }
            }
          ],

          responses: {
            200: {
              description: 'Chat retrieved'
            },

            404: {
              description: 'Chat not found'
            }
          }
        }
      }
    }
  },

  apis: []
};

export const swaggerSpec = swaggerJSDoc(options);