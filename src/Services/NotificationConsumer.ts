import PushNotifications from 'node-pushnotifications';

const APN_KEY_PATH = process.env.APN_KEY_PATH;
const APN_KEY_ID = process.env.APN_KEY_ID;
const APN_TEAM_ID = process.env.APN_TEAM_ID;
const APN_TOPIC = process.env.APN_TOPIC;

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
        production: true
    }
};

const pushNotification = new PushNotifications(settings);

interface MobileRegID {
    token: string;
    platform: string;
}

// interface registrationId {
//     id: string;
//     type: string;
// }

export default function sendNotification(mobileRegID: MobileRegID[], title: string, body: string): void {

    const registrationIds: PushNotifications.RegistrationId[] = mobileRegID.map(mobileRegID => (
        // {   id : mobileRegID.token, 
        //     type: "apn"
        // }
        mobileRegID.token
    ));

    const data = {
        title,
        body,
        topic: APN_TOPIC,
    }

    pushNotification.send(registrationIds, data, (err, result) => {
        if (err) {
            console.log("ERROR:", err);
        } else {
            console.log("SUCCESS:" , result);
        }
    });

}

