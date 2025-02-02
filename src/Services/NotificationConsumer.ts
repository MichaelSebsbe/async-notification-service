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

export default async function sendNotification(mobileRegID: MobileRegID[], title: string, body: string): Promise<void> {
    const data = {
        title,
        body,
        topic: APN_TOPIC,
    };

    // Send notifications to each token individually to handle per-token errors
    const promises = mobileRegID.map(async (regID) => {
        try {
            const result = await pushNotification.send(regID.token, data);
            console.log(`SUCCESS for token ${regID.token}:`, result);
            return result;
        } catch (err) {
            console.log(`ERROR for token ${regID.token}:`, err);
            // Don't throw, just log and continue with other tokens
            return null;
        }
    });

    // Wait for all notifications to be processed
    await Promise.allSettled(promises);
}

