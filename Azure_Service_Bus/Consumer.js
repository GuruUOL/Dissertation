const { ServiceBusClient, ReceiveMode } = require("@azure/service-bus");

const connectionString = "YOUR_SERVICE_BUS_CONNECTION_STRING";
const queueName = "YOUR_QUEUE_NAME";

const serviceBusClient = new ServiceBusClient(connectionString);

let receivedMessages = 0;
let startTime = Date.now();

async function main() {
  const receiver = serviceBusClient.createReceiver(queueName, {
    receiveMode: ReceiveMode.receiveAndDelete
  });

  receiver.subscribe({
    processMessage: async (message) => {
      const startTimestamp = message.enqueuedTimeUtc.getTime();
      
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
    },
    processError: async (err) => {
      console.error("Error occurred: ", err);
    }
  });
}

main().catch((err) => {
  console.log("Error occurred: ", err);
});
