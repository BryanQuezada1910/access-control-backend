import mqtt from "mqtt";

const mqttClient = mqtt.connect("mqtt://broker.hivemq.com");

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");

  mqttClient.subscribe("nfc/data", (err) => {
    if (!err) {
      console.log("Subscribed to myTopic");
    }
  });
});

mqttClient.on("message", (topic, message) => {
  console.log(`Received message from ${topic}: ${message.toString()}`);
});

function sendCommand(topic, message) {
  mqttClient.publish(topic, message, (err) => {
    if (err) {
      console.log(`Error publishing message: ${err}`);
    } else {
      console.log(`Message published: ${message}`);
    }
  });
}

export { sendCommand, mqttClient };