import * as amqp from 'amqplib/callback_api';
import 'dotenv/config'

class RabbitMQ {
    public static getInstance(): RabbitMQ {
        if (!RabbitMQ.instance) {
            RabbitMQ.instance = new RabbitMQ();
        }
        return RabbitMQ.instance;
    }

    private static instance: RabbitMQ | null = null;
    private queueName: string;
    private channelReady: Promise<amqp.Channel | null> = Promise.resolve(null);

    private constructor() {
        const queueName = process.env.RABBITMQ_QUEUE_NAME;

        if (!queueName) {
            throw new Error('RabbitMQ queue name is not provided. Please provide it in .env file.');
        }

        this.queueName = queueName;
        this.connect();
    }

    private connect(){
        const url = process.env.RABBITMQ_URL;

        if (!url) {
            throw new Error('RabbitMQ URL is not provided. Please provide it in .env file.');
        }

        // Initialize connection and channel
        this.channelReady = new Promise((resolve, reject) => {
            amqp.connect(url, (error0, connection) => {
                if (error0) {
                    reject(error0);
                } else {
                    connection.createChannel((error1, channel) => {
                        if (error1) {
                            reject(error1);
                        } else {
                            channel.assertQueue(this.queueName, {
                                durable: false,
                            });
                            console.log(` [*] Connected to queue: ${this.queueName}`);
                            resolve(channel);
                        }
                    });
                }
            });
        });
    }

    public async consume(onMessage: (msg: string) => void): Promise<void> {
        const channel = await this.channelReady;

        if (!channel) {
            console.error("Channel is not initialized yet.");
            return;
        }
        console.log(` [*] Waiting for messages in queue: ${this.queueName}`);
        channel.consume(this.queueName, (msg) => {
            if (msg) {
                onMessage(msg.content.toString());
            }
        }, {
            noAck: true,
        });
    }

    public async send(msg: string): Promise<void> {
        const channel = await this.channelReady;

        if(!channel) {
            console.error("Channel is not initialized yet.");
            return;
        }
        channel.sendToQueue(this.queueName, Buffer.from(msg));
        console.log(` [x] Sent: ${msg}`);
    }

    destructor(): void {
        // Close the channel
        this.channelReady.then((channel) => {
            if (channel) {
                channel.close(() => {
                    console.log(` [*] Channel closed for queue: ${this.queueName}`);
                });
            }
        });

    }
}


export default RabbitMQ;

// const rabbit = RabbitMQ.getInstance()



// // Send a message every 5 seconds
// setInterval(() => {
//     rabbit.send('Hello World!');
// }, 5000);

// // Consume messages
// rabbit.consume((msg) => {
//     console.log(` [x] Received: ${msg}`);
// });