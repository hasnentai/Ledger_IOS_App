import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DisplayAccountsPage } from './display-accounts';

@NgModule({
  declarations: [
    DisplayAccountsPage,
  ],
  imports: [
    IonicPageModule.forChild(DisplayAccountsPage),
  ],
})
export class DisplayAccountsPageModule {}
