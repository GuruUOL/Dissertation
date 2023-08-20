const RocketMQProducer = require('apache-rocketmq').Producer;
const fs = require('fs');

const producer = new RocketMQProducer({
  producerGroup: 'test_producer_group',
  nameServer: 'localhost:9876' // Replace with your RocketMQ namesrv address
});

async function publishMessage() {
  await producer.start();

  const topic = 'test_topic';
  const messageSizeInBytes = 4 * 1024; // 4KB

  setInterval(async () => {
    const message = fs.readFileSync('large_file.txt').toString(); // Replace with your message source
    const startTime = Date.now();

    const result = await producer.send({
      topic,
      body: Buffer.from(message)
    });

    const endTime = Date.now();
    const latency = endTime - startTime;
    console.log(`Sent message | Latency: ${latency} ms`);
  }, 100); // Adjust the interval as needed
}

publishMessage().catch((err) => {
  console.error('Error occurred:', err);
});
