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



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AddAccountPage,
    NewTransactionPage,
    DisplayAccountsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AddAccountPage,
    NewTransactionPage,
    DisplayAccountsPage
  ],
  providers: [
    StatusBar,
    SQLite,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
