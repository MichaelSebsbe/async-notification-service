import RabbitMQ from "./RabbitMQ/RabbitMQ";
// import { NotificationsFactory, NotificationRequest } from "./Services/Notification";
import sendNotification from "./Services/NotificationConsumer";
import { Server } from './api/Server';

const rabbit = RabbitMQ.getInstance()

async function bootstrap() {
    try {
        const server = new Server();
        await server.start(3000);
    } catch (error) {
        console.error('Failed to start application:', error);
        process.exit(1);
    }
}

bootstrap();

// Send a message every 5 seconds
// setInterval(() => {
//     const payload : NotificationRequest = {
//         title: 'Hello World',
//         body: 'This is a test notification',
//         platforms: ['ios'],
//         identifiers: [process.env.APN_TEST_DEVICE_TOKEN!]
//     }

//     rabbit.send(JSON.stringify(payload));
// }, 5000);




// Consume messages
rabbit.consume((msg) => {
    try{
        console.log(` [x] Received: ${msg}`);
        // const notifications = NotificationsFactory.create(msg);

        // for(const notification of notifications){
        //     notification.send();
        // }

        let message = JSON.parse(msg);

        sendNotification(message.tokens, message.title, message.body);
        
    }catch(e){
        console.error(`Error ${e}:  ${msg}`);
    }

});



