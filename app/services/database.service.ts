import { Medication } from '../models/medication';
import { knownFolders } from '@nativescript/core';
import * as SQLite from '@nativescript/sqlite';

export class DatabaseService {
    private database: SQLite.Database;

    constructor() {
        this.initializeDatabase();
    }

    private async initializeDatabase() {
        try {
            this.database = await new SQLite.Database('medications.db');
            await this.database.execute(`
                CREATE TABLE IF NOT EXISTS medications (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    dosage TEXT NOT NULL,
                    frequency TEXT NOT NULL,
                    timeOfDay TEXT NOT NULL,
                    image TEXT,
                    notes TEXT
                )
            `);
        } catch (error) {
            console.error('Database initialization error:', error);
        }
    }

    async saveMedication(medication: Medication): Promise<void> {
        try {
            const timeOfDayString = JSON.stringify(medication.timeOfDay);
            await this.database.execute(
                `INSERT OR REPLACE INTO medications (id, name, dosage, frequency, timeOfDay, image, notes)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [medication.id, medication.name, medication.dosage, medication.frequency, 
                 timeOfDayString, medication.image, medication.notes]
            );
        } catch (error) {
            console.error('Save medication error:', error);
            throw error;
        }
    }

    async getMedications(): Promise<Medication[]> {
        try {
            const result = await this.database.all('SELECT * FROM medications');
            return result.map(row => ({
                ...row,
                timeOfDay: JSON.parse(row.timeOfDay)
            }));
        } catch (error) {
            console.error('Get medications error:', error);
            return [];
        }
    }

    async deleteMedication(id: string): Promise<void> {
        try {
            await this.database.execute('DELETE FROM medications WHERE id = ?', [id]);
        } catch (error) {
            console.error('Delete medication error:', error);
            throw error;
        }
    }
}