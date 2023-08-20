const kafka = require('node-rdkafka');

const consumer = new kafka.KafkaConsumer({
  'group.id': 'test-group',
  'metadata.broker.list': 'localhost:9092', // Update with your broker list
  'enable.auto.commit': false
}, {});

consumer.on('event.log', function(log) {
  console.log(log);
});

consumer.on('event.error', function(err) {
  console.error('Error from consumer:', err);
});

consumer.connect();

consumer.on('ready', function() {
  console.log('Consumer ready');

  consumer.subscribe(['test_topic']); // Update with your topic

  consumer.consume();
});

let receivedMessages = 0;
let startTime = Date.now();

consumer.on('data', function(message) {
  const latency = Date.now() - message.timestamp;
  console.log(`Received message | Latency: ${latency} ms`);
  
  receivedMessages++;
  if (receivedMessages % 100 === 0) {
    const elapsedTime = (Date.now() - startTime) / 1000; // seconds
    const throughput = receivedMessages / elapsedTime;
    console.log(`Throughput: ${throughput.toFixed(2)} messages/s`);
  }

  consumer.commit(message);
});
