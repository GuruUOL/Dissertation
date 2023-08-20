const { ServiceBusClient } = require("@azure/service-bus");
const fs = require('fs');

const connectionString = "YOUR_SERVICE_BUS_CONNECTION_STRING";
const queueName = "YOUR_QUEUE_NAME";
const messageSizeInBytes = 4 * 1024; // 4KB

const serviceBusClient = new ServiceBusClient(connectionString);

async function main() {
  const sender = serviceBusClient.createSender(queueName);

  setInterval(async () => {
    const message = fs.readFileSync('large_file.txt').toString(); // Replace with your message source
    const startTime = Date.now();

    const msg = {
      body: message,
      contentType: "text/plain",
      label: "TestMessage"
    };

    await sender.sendMessages(msg);
    
    const endTime = Date.now();
    const latency = endTime - startTime;
    console.log(`Sent message | Latency: ${latency} ms`);
  }, 100); // Adjust the interval as needed
}

main().catch((err) => {
  console.log("Error occurred: ", err);
});
