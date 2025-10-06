const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EV Trading Platform API',
      version: '1.0.0',
      description: 'API Documentation for FPTU-SWP391-Fall2025-BackEnd',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8000}`,
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // hiển thị để biết là JWT token
        },
      },
    },
    security: [
      {
        bearerAuth: [], // áp dụng mặc định cho tất cả API, trừ khi override
      },
    ],
  },
  apis: ['./src/routes/*.js'], // quét swagger docs trong routes
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
