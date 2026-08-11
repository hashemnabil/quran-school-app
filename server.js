require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');

const { sequelize, User, School } = require('./models');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const studentRoutes = require('./routes/students');
const messageRoutes = require('./routes/messages');
const schoolRoutes = require('./routes/school');
const statsRoutes = require('./routes/stats');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// Rate limiting - 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// CORS
app.use(cors());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static('public'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/school', schoolRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Seed default data
async function seedData() {
  try {
    // Create default admin
    const adminCount = await User.count({ where: { role: 'admin' } });
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        name: 'مدير النظام'
      });
      console.log('✅ Default admin created: admin / admin123');
    }

    // Create default school
    const school = await School.findByPk(1);
    if (!school) {
      await School.create({ id: 1 });
      console.log('✅ Default school info created');
    }
  } catch (err) {
    console.error('Seed error:', err);
  }
}

// Connect to DB and start server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully.');

    // Sync models (create tables if not exist)
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized.');

    await seedData();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 Open: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Unable to connect to database:', err);
    process.exit(1);
  }
}

startServer();
