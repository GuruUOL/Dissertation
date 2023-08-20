const amqp = require('amqplib');

async function consume() {
  const connection = await amqp.connect('amqp://localhost'); // Replace with your RabbitMQ server URL
  const channel = await connection.createChannel();

  const queue = 'test_queue';

  await channel.assertQueue(queue);
  channel.consume(queue, (message) => {
    if (message !== null) {
      const latency = Date.now() - new Date(message.properties.timestamp);
      console.log(`Received message | Latency: ${latency} ms`);
      channel.ack(message);
    }
  });
}

consume().catch(console.error);
