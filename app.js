const express = require('express');
const mongoose = require('mongoose');
const notificationRoutes = require('./routes/notification.js');
const notificationQueue = require('./queue/notificationqueue.js');
const processNotification = require('./workers/notificationworkers.js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/notification-service';

// Middleware
app.use(express.json());



// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Routes
app.use('/', notificationRoutes);

// Connect to MongoDB and start server
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    
    // Register the notification processor with the queue
    notificationQueue.process(processNotification);
    console.log('✅ Notification queue processor registered');
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      // console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  });

// Graceful shutdown
const shutdown = async () => {
  console.log('🛑 Shutting down gracefully...');
  
  try {
    // Close the queue
    await notificationQueue.close();
    console.log('✅ Notification queue closed');
    
    // Close MongoDB connection
    await mongoose.connection.close();
    
    
    console.log('👋 Server shutdown complete');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during shutdown:', err);
    process.exit(1);
  }
};

// Handle termination signals
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);