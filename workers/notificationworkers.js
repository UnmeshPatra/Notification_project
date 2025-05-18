const Notification = require('../models/notification.js');

// Notification sender implementations
const notificationSenders = {

  email: async ({ userId, message }) => {
    console.log(`📧 Sending EMAIL to user ${userId}: ${message}`);
    
    
    const success = Math.random() > 0.3; 
    
    if (!success) {
      throw new Error('Email service unavailable');
    }
    
    // Email sent successfully
    return { success: true };
  },
  
  sms: async ({ userId, message }) => {
    console.log(`📱 Sending SMS to user ${userId}: ${message}`);
    
    
    const success = Math.random() > 0.2; // 20% chance of failure 
    
    if (!success) {
      throw new Error('SMS gateway error');
    }
    
    // SMS sent successfully
    return { success: true };
  },
  
  'in-app': async ({ userId, message }) => {
    console.log(`🔔 Sending IN-APP notification to user ${userId}: ${message}`);
    
    
    const success = Math.random() > 0.1; // 10% chance of failure 
    
    if (!success) {
      throw new Error('Push notification service error');
    }
    
    
    return { success: true };
  }
};


const processNotification = async (job) => {
  const { notificationId, userId, type, message } = job.data;
  console.log(`Processing ${type} notification (ID: ${notificationId}) for user ${userId}`);
  
  try {
    
    await Notification.findByIdAndUpdate(
      notificationId,
      { 
        status: 'processing',
        attempts: job.attemptsMade + 1
      }
    );
    
    
    if (!notificationSenders[type]) {
      throw new Error(`Unsupported notification type: ${type}`);
    }
    
   
    await notificationSenders[type]({ userId, message });
    
   
    await Notification.findByIdAndUpdate(
      notificationId,
      { status: 'sent' }
    );
    
    console.log(`Successfully sent ${type} notification to user ${userId}`);
    return { success: true };
  } catch (error) {
    console.error(`Failed to send ${type} notification: ${error.message}`);
    
    
    if (job.attemptsMade >= job.opts.attempts - 1) {
      
      await Notification.findByIdAndUpdate(
        notificationId,
        { 
          status: 'failed',
          errorMessage: error.message
        }
      );
    } else {
      
      await Notification.findByIdAndUpdate(
        notificationId,
        { 
          status: 'retrying',
          errorMessage: error.message
        }
      );
    }
    
    
    throw error;
  }
};

module.exports = processNotification;