import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { AddAccountPage } from "../add-account/add-account";
import { NewTransactionPage } from "../new-transaction/new-transaction";
import { DisplayAccountsPage } from "../display-accounts/display-accounts";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  addAccount = AddAccountPage;
  newTransaction = NewTransactionPage;
  allAccounts = DisplayAccountsPage;
  names = [
    {
      name: "Hasnen",
      amoutn: "1200",
      date: "12-Sept-18"
    },
    {
      name: "Saumil",
      amoutn: "2000",
      date: "12-Sept-18"
    },
    {
      name: "Mayur",
      amoutn: "200",
      date: "12-Sept-18"
    },
    {
      name: "Juned",
      amoutn: "1200",
      date: "12-Sept-18"
    },
    {
      name: "Uddesh",
      amoutn: "400",
      date: "12-Sept-18"
    },
    {
      name: "Sumana",
      amoutn: "900",
      date: "12-Sept-18"
    },
    {
      name: "Purnima",
      amoutn: "300",
      date: ""
    },
    {
      name: "Hasnen",
      amoutn: "200",
      date: ""
    }
  ];

  constructor(public navCtrl: NavController, private sqlite: SQLite) {}
  ionViewDidLoad() {
    this.getData();
  }

  getData() {
    this.sqlite
      .create({
        name: "ledgerdb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        db.executeSql(
          "CREATE TABLE  new_account (aid INTEGER PRIMARY KEY AUTOINCREMENT , aname , phone , descritpion)",
        )
          .then(() => alert("Executed SQL"))
          .catch(e => alert(JSON.stringify(e)));
        db.executeSql(
          "CREATE TABLE new_transaction(tid INTEGER PRIMARY KEY AUTOINCREMENT , aid INTEGER ,tamount , tdate , descritpion,FOREIGN KEY(aid) REFERENCES new_account (aid))",
        )
          .then(() => alert("Executed SQL"))
          .catch(e => alert(JSON.stringify(e)));
      });
  }
}
