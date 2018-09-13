import { DetailpagePageModule } from '../pages/detailpage/detailpage.module';
import { SettingsPage } from '../pages/settings/settings';
import { NewTransactionPage } from '../pages/new-transaction/new-transaction';
import { AddAccountPage } from '../pages/add-account/add-account';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { DisplayAccountsPage } from '../pages/display-accounts/display-accounts';
import { SQLite } from '@ionic-native/sqlite';
import { DetailpagePage } from '../pages/detailpage/detailpage';
import { SettingsPageModule } from '../pages/settings/settings.module';
import { AddAccountPageModule } from '../pages/add-account/add-account.module';
import { NewTransactionPageModule } from '../pages/new-transaction/new-transaction.module';
import { DisplayAccountsPageModule } from '../pages/display-accounts/display-accounts.module';
import { CallNumber } from '@ionic-native/call-number';






@NgModule({
  declarations: [
    MyApp,
    HomePage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    DetailpagePageModule,
    SettingsPageModule,
    AddAccountPageModule,
    NewTransactionPageModule,
    DisplayAccountsPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
  ],
  providers: [
    StatusBar,
    SQLite,
    SplashScreen,
    CallNumber,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
