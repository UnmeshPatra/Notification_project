const Queue = require('bull');

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 10000; // 10 seconds in milliseconds

const notificationQueue = new Queue('notifications', {
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
  defaultJobOptions: {
    attempts: RETRY_ATTEMPTS,
    backoff: {
      type: 'exponential',
      delay: RETRY_DELAY
    },
    removeOnComplete: true,
    removeOnFail: false
  }
});

// Event handlers for monitoring
notificationQueue.on('completed', (job) => {
  console.log(`Job ${job.id} completed for ${job.data.type} notification to user ${job.data.userId}`);
});

notificationQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed with error: ${err.message}`);
  console.error(`Retry count: ${job.attemptsMade} of ${RETRY_ATTEMPTS}`);
  
  if (job.attemptsMade >= RETRY_ATTEMPTS) {
    console.error(`All retry attempts exhausted for job ${job.id}. Notification failed permanently.`);
  }
});

notificationQueue.on('stalled', (job) => {
  console.warn(`Job ${job.id} stalled and will be reprocessed`);
});

module.exports = notificationQueue;