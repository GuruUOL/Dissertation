const rocketmq = require('rocketmq-nodejs-client');
const { PerformanceObserver, performance } = require('perf_hooks');

const consumer = new rocketmq.PushConsumer({
  consumerGroup: 'test_group', // Replace with your consumer group
  namesrv: 'localhost:9876' // Replace with your RocketMQ namesrv address
});

const observer = new PerformanceObserver((list) => {
  const entry = list.getEntries()[0];
  const latency = entry.duration;
  console.log(`Received message | Latency: ${latency} ms`);
});
observer.observe({ entryTypes: ['measure'] });

consumer.on('message', async (message) => {
  const start = performance.now();

  // Process the message

  const end = performance.now();
  performance.measure('message-received', start, end);

  consumer.ack(message);
});

consumer.subscribe('test_topic'); // Replace with your topic

consumer.start();
