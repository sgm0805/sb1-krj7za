import { Observable } from '@nativescript/core';
import { Medication } from '../models/medication';
import { StorageService } from './storage.service';

export class MedicationStore extends Observable {
    private medications: Map<string, Medication> = new Map();
    private storageService: StorageService;

    constructor() {
        super();
        this.storageService = new StorageService();
        this.loadMedications();
    }

    private loadMedications() {
        this.medications = this.storageService.getMedications();
        this.notifyPropertyChange('medications', this.getMedications());
    }

    addMedication(medication: Medication) {
        this.medications.set(medication.id, medication);
        this.storageService.saveMedication(medication);
        this.notifyPropertyChange('medications', this.getMedications());
    }

    getMedications(): Medication[] {
        return Array.from(this.medications.values());
    }

    getMedication(id: string): Medication | undefined {
        return this.medications.get(id);
    }

    deleteMedication(id: string) {
        this.medications.delete(id);
        this.storageService.deleteMedication(id);
        this.notifyPropertyChange('medications', this.getMedications());
    }
}