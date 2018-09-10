import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";

/**
 * Generated class for the DisplayAccountsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-display-accounts",
  templateUrl: "display-accounts.html"
})
export class DisplayAccountsPage {
  items;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public sqlite: SQLite
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad DisplayAccountsPage");
    this.getData();
  }

  getData() {
    this.sqlite
      .create({
        name: "ledgerdb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        db.executeSql('select * from new_account')
          .then((data) => {
            alert(JSON.stringify(data))
            this.items = [];
            if (data.rows.length > 0) {
              for (var i = 0; i < data.rows.length; i++) {
                var obj = JSON.parse(data.rows.item(i).allvalues);
              }
              alert(obj);
            }
          },
          (err) => {
            alert('Unable to execute sql: '+JSON.stringify(err));
            });
      })
          .catch(e => alert("HEY Error "+JSON.stringify(e)));
      
  }
}
