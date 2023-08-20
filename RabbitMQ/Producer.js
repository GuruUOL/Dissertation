const amqp = require('amqplib');
const fs = require('fs');

async function produce() {
  const connection = await amqp.connect('amqp://localhost'); // Replace with your RabbitMQ server URL
  const channel = await connection.createChannel();

  const queue = 'test_queue';

  await channel.assertQueue(queue);

  setInterval(async () => {
    const message = fs.readFileSync('large_file.txt').toString(); // Replace with your message source
    channel.sendToQueue(queue, Buffer.from(message));
    console.log('Message sent');
  }, 100); // Adjust the interval as needed
}

produce().catch(console.error);
