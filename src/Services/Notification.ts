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

