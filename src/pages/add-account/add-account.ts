import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";

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
    account_name : '',
    account_phone : '',
    account_dec : ''
  }
  accountName= this.accountData.account_name;
  constructor(public navCtrl: NavController, public navParams: NavParams,public sqlite :SQLite) {
  }
  logForm(){
    alert(JSON.stringify(this.accountData.account_name));
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
          "INSERT INTO new_account (aname,phone,descritpion) VALUES(?,?,?)",[this.accountData.account_name,this.accountData.account_phone,this.accountData.account_dec]
        )
          .then(() => alert("Executed SQL"))
          .catch(e => alert(JSON.stringify(e)));
      });
  }


}
