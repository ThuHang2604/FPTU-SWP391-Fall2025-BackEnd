const express = require('express');
const cors = require('cors');
require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./src/config/swagger'); 

const app = express();
app.use(cors());
app.use(express.json());

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.get('/', (req, res) =>
  res.send('✅ EV Trading Platform Backend is running...')
);

const authRoutes = require('./src/routes/auth.routes');
app.use('/api/auth', authRoutes);

const categoryRoutes = require('./src/routes/category.routes');
app.use('/api/categories', categoryRoutes);

const productRoutes = require('./src/routes/product.routes');
app.use('/api/products', productRoutes);

const productMediaRoutes = require('./src/routes/productMedia.routes');
app.use('/api/product-media', productMediaRoutes);

const productApprovalRoutes = require('./src/routes/productApproval.routes');
app.use('/api/product-approvals', productApprovalRoutes);

// DB setup
const db = require('./src/models');
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
