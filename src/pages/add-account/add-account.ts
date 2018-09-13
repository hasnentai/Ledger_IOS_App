import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { ToastController } from 'ionic-angular';

/**
 * Generated class for the AddAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-account',
  templateUrl: 'add-account.html',
})
export class AddAccountPage {
  accountData={
    account_dec :'',
    account_phone:'',
    account_name :''
  }
  accountName= this.accountData.account_name;
  constructor(public navCtrl: NavController, public navParams: NavParams,public sqlite :SQLite,public toastCtrl: ToastController) {
  }
  presentToast(msg) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  logForm(){
    console.log(JSON.stringify(this.accountData.account_name));
    this.pushData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddAccountPage');

  }

  pushData() {
    this.sqlite
      .create({
        name: "ledgerdb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        db.executeSql(
          "INSERT INTO myaccount (aname,phone,descritpion) VALUES(?,?,?)",[this.accountData.account_name,this.accountData.account_phone,this.accountData.account_dec]
        )
          .then(() => {console.log("Executed SQL")
        this.presentToast('User was added successfully')
        
        })
          .catch(e => console.log(JSON.stringify(e)));
      });
  }


}
