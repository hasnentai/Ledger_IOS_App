import { DetailpagePage } from '../detailpage/detailpage';
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
  results: any;
  items;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public sqlite: SQLite,
  ) {}
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
        return db.executeSql("select * from myaccount", []);
      })
      .then((data) => {
        this.results = [];
        for (let i = 0; i < data.rows.length; i++) {
          console.log(data.rows.item(i).phone);
          let phone = data.rows.item(i).phone;
          let name = data.rows.item(i).aname;
          let id = data.rows.item(i).aid;
          this.results.push({
            'phone' : phone,
            'name' : name,
            'id' : id
          })
        }
      })
      .catch(e => console.log("You Got This Errro" + JSON.stringify(e)));
  }

  nextPage(id,userName,phone){
    console.log(id);
    this.navCtrl.push(DetailpagePage,{
      'id' : id,
      'userName' : userName,
      'phone' : phone
    })
  }
}
