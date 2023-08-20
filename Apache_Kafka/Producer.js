const kafka = require('node-rdkafka');
const fs = require('fs');

const producer = new kafka.Producer({
  'metadata.broker.list': 'localhost:9092', // Update with your broker list
  'dr_cb': true
});

producer.on('event.log', function(log) {
  console.log(log);
});

producer.on('event.error', function(err) {
  console.error('Error from producer:', err);
});

producer.connect();

producer.on('ready', function() {
  console.log('Producer ready');

  const topic = 'test_topic';
  const messageSizeInBytes = 4 * 1024; // 4KB

  setInterval(() => {
    const message = fs.readFileSync('large_file.txt').toString(); // Replace with your message source
    producer.produce(topic, null, Buffer.from(message), null, Date.now());
  }, 100); // Adjust the interval as needed
});

producer.on('delivery-report', function(err, report) {
  if (err) {
    console.error('Delivery report error:', err);
  } else {
    console.log('Message delivered:', report);
  }
});
