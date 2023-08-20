const RocketMQConsumer = require('apache-rocketmq').Consumer;

const consumer = new RocketMQConsumer({
  consumerGroup: 'test_consumer_group',
  nameServer: 'localhost:9876' // Replace with your RocketMQ namesrv address
});

let receivedMessages = 0;
let startTime = Date.now();

async function subscribeAndConsume() {
  await consumer.subscribe({
    topic: 'test_topic',
    onMessage: async (message) => {
      const startTimestamp = message.properties.startDeliverTime; // Start timestamp provided by RocketMQ
      
      // Process the message
      
      const endTimestamp = Date.now();
      const latency = endTimestamp - startTimestamp;
      console.log(`Received message | Latency: ${latency} ms`);

      receivedMessages++;
      if (receivedMessages % 100 === 0) {
        const elapsedTime = (Date.now() - startTime) / 1000; // seconds
        const throughput = receivedMessages / elapsedTime;
        console.log(`Throughput: ${throughput.toFixed(2)} messages/s`);
      }

      await message.ack();
    }
  });

  await consumer.start();
}

subscribeAndConsume().catch((err) => {
  console.error('Error occurred:', err);
});
