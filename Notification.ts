import PushNotifications from 'node-pushnotifications';

import { config } from 'dotenv';

const APN_KEY_PATH = process.env.APN_KEY_PATH;
const APN_KEY_ID = process.env.APN_KEY_ID;
const APN_TEAM_ID = process.env.APN_TEAM_ID;
const APN_TOPIC = process.env.APN_TOPIC;


export interface Notification{
    //constructor(identifiers: Array<string>, title: string, body: string): Notification;
    send(): void;
}

export interface NotificationRequest{
    title: string;
    body: string;
    platforms: string[];
    identifiers: string[];
}

function validateNotificationRequest(data: any): data is NotificationRequest {
    return typeof data.title === "string" &&
        typeof data.body === "string" &&
        Array.isArray(data.platforms) &&
        Array.isArray(data.identifiers);
}

function parseNotificationRequest(jsonString: string): NotificationRequest {
    const data = JSON.parse(jsonString);

    if (!validateNotificationRequest(data)) {
        throw new Error("Invalid JSON structure");
    }

    return data;
}


export class NotificationsFactory{
    public static create(data: any): Notification[]{
        const request = parseNotificationRequest(data);

        let notifications: Notification[] = [];

        for(const platform of request.platforms){
            switch(platform){
                case 'ios':
                    notifications.push(new IosNotification(request.identifiers, request.title, request.body));
                    break;
                //case 'android':
                   // return new AndroidNotification();
                default:
                    throw new Error(`Unsupported platform '${platform}'`);
            }
        
        }

        return notifications;

    }
}


class IosNotification implements Notification {
    private tokens: Array<string>;
    private title: string;
    private body: string;
    private push: PushNotifications;

    constructor(tokens: Array<string>, title: string, body: string) {
        
        this.tokens = tokens;
        this.title = title;
        this.body = body;


        const settings = {
            // fcm: {
            //     appName: 'localFcmAppName',
            //     serviceAccountKey: require('../firebase-project-service-account-key.json'), // firebase service-account-file.json,
            //     credential: null // 'firebase-admin' Credential interface
            // },
            apn: {
                token: {
                    key: APN_KEY_PATH,
                    keyId: APN_KEY_ID,
                    teamId: APN_TEAM_ID
                },
                production: false
            }
        };

        this.push = new PushNotifications(settings);
    }


    public send(): void { 
        const data = {
            title: this.title,
            body: this.body,
            topic: APN_TOPIC,
        }

        this.push.send(this.tokens, data, (err, result) => {
            if (err) {
                console.log("ERROR:", err);
            } else {
                console.log("SUCCESS:" , JSON.stringify(result));
            }
        });
    }
}



// // Single destination
// const registrationId = 'INSERT_YOUR_DEVICE_ID';

// // Multiple destinations
// const registrationIds = [];
// registrationIds.push('INSERT_YOUR_DEVICE_ID');
// registrationIds.push('INSERT_OTHER_DEVICE_ID');

// const regID = {
//     registrationIds: registrationIds,
//     type: 'apn' // | 'fcm'
// }

// const data = {
//     title: 'Hello',
//     body: 'World',
//     topic: 'your.app.bundle.id',
//     priority : 'high', // 'high' | 'normal'
//     timeToLive: 28 * 86400, // 28 days
// }

// push.send(registrationIds, data, (err, result) => {
//     if (err) {
//         console.log(err);
//     } else {
// 	    console.log(result);
//     }
// });


// class IosNotification {
//     private token: string;
//     private title: string;
//     private body: string;

//     constructor(token: string, title: string, body: string) {
//         this.token = token;
//         this.title = title;
//         this.body = body;
//     }


//     public async send(sandbox : boolean = false): Promise<void> {
//         const apnProvider = new apn.Provider({
//             token: {
//                 key: "path/to/APNsAuthKey.p8",
//                 keyId: "your-key-id",
//                 teamId: "your-team-id"
//             },
//             production: !sandbox // Set to true if sending to production
//         });

//         const notification = new apn.Notification();
//         notification.alert = {
//             title: this.title,
//             body: this.body
//         };
//         notification.topic = "your.app.bundle.id";

//         try {
//             const result = await apnProvider.send(notification, this.token);
//             console.log(result);
//         } catch (error) {
//             console.error("Error sending notification:", error);
//         } finally {
//             apnProvider.shutdown();
//         }
//     }
// }