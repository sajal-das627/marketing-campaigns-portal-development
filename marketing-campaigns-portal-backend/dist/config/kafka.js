"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kafka_node_1 = __importDefault(require("kafka-node"));
const client = new kafka_node_1.default.KafkaClient({ kafkaHost: "localhost:9092" });
const producer = new kafka_node_1.default.Producer(client);
producer.on("ready", () => console.log("Kafka Producer is ready"));
producer.on("error", (err) => console.error("Kafka Producer error:", err));
exports.default = producer;
const consumer = new kafka_node_1.default.Consumer(client, [{ topic: "real-time-campaigns" }], { autoCommit: true });
consumer.on("message", (message) => {
    console.log("Real-Time Campaign Triggered:", JSON.parse(message.value));
});
consumer.on("error", (err) => console.error("Kafka Consumer Error:", err));
