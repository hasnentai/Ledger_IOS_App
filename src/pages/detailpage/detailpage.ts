import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { CallNumber } from '@ionic-native/call-number';

/**
 * Generated class for the DetailpagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-detailpage",
  templateUrl: "detailpage.html"
})
export class DetailpagePage {
  disRupee: boolean;
  amount: any;
  active: any;
  msg: string;
  empty=false;
  newAeeay;
  results: any;
  userName;
  id;
  phone;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public sqlite: SQLite,
    private callNumber: CallNumber
  ) {}

  makeCall(number){
    console.log("helo")
    this.callNumber.callNumber(number,true)
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad DetailpagePage");
    this.userName = this.navParams.get("userName");
    this.id = this.navParams.get("id");
    this.phone = this.navParams.get("phone");
    this.active = this.navParams.get("active");
    this.amount = this.navParams.get("amount");
    console.log(this.phone);
    if(this.amount == null) {
      this.disRupee = false;
    }
    else {
      this.disRupee = true;
    }
    this.sqlite
      .create({
        name: "ledgerdb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        return db.executeSql("select * from mytransaction where aid=?", [
          parseInt(this.id)
        ]);
      })
      .then(data => {
        this.results = [];
        for (let i = 0; i < data.rows.length; i++) {
          console.log(data.rows.item(i).tamount);
          let amount = data.rows.item(i).tamount;
          let date = data.rows.item(i).tdate;
          let trans = data.rows.item(i).descritpion;
          this.results.push({
            amount: amount,
            date: date,
            trans: trans
          });
        }
        console.log(this.results.length);
        if(this.results.length == 0) {
          this.empty = true;
          this.msg = "No Transaction's Are Done Yet"
        }
        
      })
      .then(() => {
        console.log("WE DID IT");
      })
      .catch(e => {
        console.log(JSON.stringify(e));
      });
  }
}
