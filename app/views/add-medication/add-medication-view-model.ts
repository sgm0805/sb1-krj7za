import { Observable, ImageSource } from '@nativescript/core';
import * as camera from '@nativescript/camera';
import { VoiceService } from '../../services/voice-service';
import { MedicationStore } from '../../services/medication-store';
import { NotificationService } from '../../services/notification-service';
import { Frame } from '@nativescript/core';
import { i18n } from '../../i18n';

export class AddMedicationViewModel extends Observable {
    private voiceService: VoiceService;
    private medicationStore: MedicationStore;
    private notificationService: NotificationService;

    name: string = '';
    dosage: string = '';
    frequencies = [
        i18n.t('frequencies.onceDaily'),
        i18n.t('frequencies.twiceDaily'),
        i18n.t('frequencies.thriceDaily'),
        i18n.t('frequencies.asNeeded')
    ];
    selectedFrequencyIndex: number = 0;
    hour: number = 9;
    minute: number = 0;
    medicineImage: ImageSource | null = null;

    constructor() {
        super();
        this.voiceService = new VoiceService();
        this.medicationStore = new MedicationStore();
        this.notificationService = new NotificationService();
    }

    L(key: string, params = {}): string {
        return i18n.t(key, params);
    }

    async startVoiceInput() {
        try {
            const text = await this.voiceService.startVoiceRecognition();
            if (text) {
                this.name = text;
                this.notifyPropertyChange('name', this.name);
            }
        } catch (error) {
            console.error('Voice input error:', error);
        }
    }

    async scanMedicineLabel() {
        try {
            const available = await camera.requestCameraPermissions();
            if (!available) {
                console.error('Camera not available');
                return;
            }

            const imageAsset = await camera.takePicture({
                saveToGallery: false,
                keepAspectRatio: true,
                width: 800,
                height: 800
            });
            
            this.medicineImage = await ImageSource.fromAsset(imageAsset);
            this.notifyPropertyChange('medicineImage', this.medicineImage);
        } catch (error) {
            console.error('Camera error:', error);
        }
    }

    async saveReminder() {
        if (!this.name || !this.dosage) {
            return;
        }

        const now = new Date();
        const reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), this.hour, this.minute);

        const medication = {
            id: Date.now().toString(),
            name: this.name,
            dosage: this.dosage,
            frequency: this.frequencies[this.selectedFrequencyIndex],
            timeOfDay: [reminderTime],
            image: this.medicineImage ? this.medicineImage.toBase64String('png') : undefined
        };

        await this.medicationStore.addMedication(medication);
        await this.notificationService.scheduleNotification(medication);
        Frame.topmost().goBack();
    }
}