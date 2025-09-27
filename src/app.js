const express = require('express');
const cors = require('cors');
require('dotenv').config();

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(cors());
app.use(express.json());

// Swagger config
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
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.get('/', (req, res) =>
  res.send('✅ EV Trading Platform Backend is running...')
);

const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// DB setup
const db = require('./models');
db.sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Database connected');
    return db.sequelize.sync({ alter: true });
  })
  .then(() => console.log('✅ Models synced with DB'))
  .catch((err) => console.error('❌ Database error:', err));

// Error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('❌ Something broke!');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
