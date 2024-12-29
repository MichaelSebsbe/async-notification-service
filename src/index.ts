import RabbitMQ from "../RabbitMQ/RabbitMQ";
import { NotificationsFactory, NotificationRequest } from "../Notification";

const rabbit = RabbitMQ.getInstance()



// Send a message every 5 seconds
setInterval(() => {
    const payload : NotificationRequest = {
        title: 'Hello World',
        body: 'This is a test notification',
        platforms: ['ios'],
        identifiers: [process.env.APN_TEST_DEVICE_TOKEN!]
    }

    rabbit.send(JSON.stringify(payload));
}, 5000);




// Consume messages
rabbit.consume((msg) => {
    try{
        const notifications = NotificationsFactory.create(msg);

        for(const notification of notifications){
            notification.send();
        }
        
    }catch(e){
        console.error(`Error ${e}:  ${msg}`);
    }

});



