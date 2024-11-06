import { LocalNotifications } from '@nativescript/local-notifications';
import { Medication } from '../models/medication';
import { i18n } from '../i18n';

export class NotificationService {
    async scheduleNotification(medication: Medication) {
        const notifications = medication.timeOfDay.map((time, index) => ({
            id: parseInt(medication.id + index),
            title: i18n.t('notifications.reminder'),
            body: i18n.t('notifications.timeToTake', {
                medication: medication.name,
                dosage: medication.dosage
            }),
            scheduled: true,
            at: time
        }));

        await LocalNotifications.schedule(notifications);
    }

    async cancelNotification(medicationId: string) {
        await LocalNotifications.cancel(parseInt(medicationId));
    }
}