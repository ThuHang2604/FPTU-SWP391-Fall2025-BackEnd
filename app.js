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

// Default route
app.get('/', (req, res) =>
  res.send('✅ EV Trading Platform Backend is running...')
);

// ================= ROUTES =================
const authRoutes = require('./src/routes/auth.routes');
const categoryRoutes = require('./src/routes/category.routes');
const productRoutes = require('./src/routes/product.routes');
const productMediaRoutes = require('./src/routes/productMedia.routes');
const productApprovalRoutes = require('./src/routes/productApproval.routes');
const chatRoutes = require('./src/routes/chat.routes');
const reviewRoutes = require('./src/routes/review.routes');
const notificationRoutes = require('./src/routes/notification.routes');
const userRoutes = require('./src/routes/user.routes');
const paymentRoutes = require('./src/routes/payment.routes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/product-media', productMediaRoutes);
app.use('/api/product-approvals', productApprovalRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);

// ================= DATABASE CONNECTION =================
const db = require('./src/models');
db.sequelize
  .authenticate()
  .then(() => console.log('✅ Database connected'))
  .catch((err) => console.error('❌ Database connection error:', err));

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  res.status(500).send('❌ Something broke!');
});

module.exports = app;
