const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true,
    index: true  
  },
  type: { 
    type: String, 
    required: true,
    enum: ['email', 'sms', 'in-app']  
  },
  message: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    required: true,
    enum: ['queued', 'processing', 'sent', 'failed', 'retrying'],
    default: 'queued'
  },
  attempts: {
    type: Number,
    default: 0
  },
  errorMessage: {
    type: String
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
}, {
  timestamps: true  
});

module.exports = mongoose.model('Notification', NotificationSchema);