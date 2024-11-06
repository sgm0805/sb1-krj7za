import { NavigatedData, Page } from '@nativescript/core';
import { AddMedicationViewModel } from './add-medication-view-model';

export function navigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    if (!page.bindingContext) {
        page.bindingContext = new AddMedicationViewModel();
    }
}