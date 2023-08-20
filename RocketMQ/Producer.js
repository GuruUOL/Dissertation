const rocketmq = require('rocketmq-nodejs-client');
const fs = require('fs');
const { PerformanceObserver, performance } = require('perf_hooks');

const producer = new rocketmq.Producer({
  namesrv: 'localhost:9876' // Replace with your RocketMQ namesrv address
});

producer.start();

const topic = 'test_topic';
const messageSizeInBytes = 4 * 1024; // 4KB

const observer = new PerformanceObserver((list) => {
  const entry = list.getEntries()[0];
  const latency = entry.duration;
  console.log(`Sent message | Latency: ${latency} ms`);
});
observer.observe({ entryTypes: ['measure'] });

producer.on('ready', async () => {
  console.log('Producer ready');

  setInterval(async () => {
    const message = fs.readFileSync('large_file.txt').toString(); // Replace with your message source
    const start = performance.now();
    
    const msg = new rocketmq.Message('test_message', Buffer.from(message));
    msg.topic = topic;
    await producer.send(msg);

    const end = performance.now();
    performance.measure('message-sent', start, end);
  }, 100); // Adjust the interval as needed
});
