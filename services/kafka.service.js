
const os = require("os");
const { Kafka } = require('kafkajs')
const AppConfig = require("../config/app.config")

// Kafka for server
const kafka = new Kafka({
    clientId: 'api-server',
    brokers: AppConfig.KAFKA_BROKERS
})
const producer = kafka.producer()

const KafkaService = {
    async initKafka() {
        await producer.connect()
    },

    async send(topic, message) {
        await producer.send({
            topic: topic,
            messages: [
                { key: message.mpName, value: JSON.stringify(message) }
            ],
        })
    },

    async subscribe(topic, groupId, callback) {
        // { groupId: 'api-gw-' + os.hostname()}

        const consumer = kafka.consumer({ groupId })
        await consumer.connect()

        await consumer.subscribe({
            topic: topic,
            fromBeginning: false
        })

        if (!callback) {
            consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log({
                        value: message.value.toString(),
                    })
                },
            })
        }
        else {
            consumer.run({
                eachMessage: callback,
            })
        }
    }
}

module.exports = KafkaService