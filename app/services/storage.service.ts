import { ApplicationSettings } from '@nativescript/core';
import { Medication } from '../models/medication';

export class StorageService {
    private readonly STORAGE_KEY = 'medications';

    saveMedication(medication: Medication): void {
        const medications = this.getMedications();
        medications.set(medication.id, medication);
        this.saveMedications(medications);
    }

    getMedications(): Map<string, Medication> {
        const medicationsString = ApplicationSettings.getString(this.STORAGE_KEY);
        if (!medicationsString) {
            return new Map();
        }
        const medicationsArray = JSON.parse(medicationsString);
        return new Map(medicationsArray);
    }

    deleteMedication(id: string): void {
        const medications = this.getMedications();
        medications.delete(id);
        this.saveMedications(medications);
    }

    private saveMedications(medications: Map<string, Medication>): void {
        const medicationsArray = Array.from(medications.entries());
        ApplicationSettings.setString(this.STORAGE_KEY, JSON.stringify(medicationsArray));
    }
}