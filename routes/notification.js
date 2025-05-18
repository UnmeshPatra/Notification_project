const express = require('express');
const router = express.Router();
const Notification = require('../models/notification.js');
const notificationQueue = require('../queue/notificationqueue.js'); 

router.post('/notifications', async (req, res) => {
  const { userId, type, message } = req.body;
  
 
  if (!userId || !userId.trim()) {
    return res.status(400).json({ error: 'userId is required' });
  }
  
  if (!type || !['email', 'sms', 'in-app'].includes(type)) {
    return res.status(400).json({ 
      error: 'Valid notification type is required (email, sms, or in-app)' 
    });
  }
  
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'message is required' });
  }

  try {
   
    const notification = new Notification({
      userId,
      type,
      message,
      status: 'queued'
    });
    
    await notification.save();

    
    await notificationQueue.add({
      notificationId: notification._id.toString(),
      userId,
      type,
      message
    });

    res.status(201).json({ 
      success: true, 
      notification 
    });
  } catch (err) {
    console.error(`Failed to queue notification: ${err.message}`);
    res.status(500).json({ 
      error: 'Failed to queue notification',
      message: err.message 
    });
  }
});


router.get('/users/:id/notifications', async (req, res) => {
  const userId = req.params.id;
  
  if (!userId || !userId.trim()) {
    return res.status(400).json({ error: 'Valid userId is required' });
  }
  
  try {
    // Fetch notifications 
    const notifications = await Notification.find({ userId })
      .sort({ timestamp: -1 })
      .limit(100);
      
    res.status(200).json({ notifications });
  } catch (err) {
    console.error(`Failed to fetch notifications: ${err.message}`);
    res.status(500).json({ 
      error: 'Failed to fetch notifications',
      message: err.message 
    });
  }
});

router.get('/notifications/:id', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.status(200).json({ notification });
  } catch (err) {
    res.status(500).json({ 
      error: 'Failed to fetch notification',
      message: err.message 
    });
  }
});

module.exports = router;