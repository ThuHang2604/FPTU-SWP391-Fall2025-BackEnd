const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EV Trading Platform API',
      version: '1.0.0',
      description: 'API Documentation for FPTU-SWP391-Fall2025-BackEnd',
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 8000}` }],
  },
  apis: ['./src/routes/*.js'], // Swagger sẽ đọc docs trong các file routes
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
