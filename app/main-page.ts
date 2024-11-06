import { EventData, Page, NavigatedData } from '@nativescript/core';
import { MainViewModel } from './main-view-model';

let viewModel: MainViewModel;

export function navigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    
    if (!viewModel) {
        viewModel = new MainViewModel();
    }
    
    page.bindingContext = viewModel;
}

export function onNavigatedTo(args: NavigatedData) {
    const page = <Page>args.object;
    viewModel = page.bindingContext as MainViewModel;
    viewModel.refreshMedications();
}