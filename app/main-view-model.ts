import { Observable, Frame } from '@nativescript/core';
import { MedicationStore } from './services/medication-store';
import { NotificationService } from './services/notification-service';
import { VoiceService } from './services/voice-service';
import { i18n } from './i18n';

export class MainViewModel extends Observable {
    private medicationStore: MedicationStore;
    private notificationService: NotificationService;
    private voiceService: VoiceService;

    constructor() {
        super();
        this.medicationStore = new MedicationStore();
        this.notificationService = new NotificationService();
        this.voiceService = new VoiceService();
    }

    L(key: string, params = {}): string {
        return i18n.t(key, params);
    }

    get medications() {
        return this.medicationStore.getMedications();
    }

    async refreshMedications() {
        this.notifyPropertyChange('medications', this.medications);
    }

    onAddMedication() {
        Frame.topmost().navigate({
            moduleName: 'app/views/add-medication/add-medication-page',
            clearHistory: false,
            animated: true,
            transition: {
                name: 'slide',
                duration: 200,
                curve: 'ease'
            }
        });
    }

    async onMedicationOptions(args: any) {
        const medication = args.object.bindingContext;
        // Implementation for medication options
    }
}