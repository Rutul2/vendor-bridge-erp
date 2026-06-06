const swaggerOptions = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'VendorBridge API',
      version: '1.0.0',
      description: 'Procurement and Vendor Management ERP API',
    },
    servers: [{ url: 'http://localhost:4000/api', description: 'Local API server' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/modules/**/*.js'],
};

export default swaggerOptions;
