import { DetailpagePage } from '../detailpage/detailpage';
import { SettingsPage } from '../settings/settings';
import { Component,Renderer2,ElementRef } from "@angular/core";
import { NavController } from "ionic-angular";
import { AddAccountPage } from "../add-account/add-account";
import { NewTransactionPage } from "../new-transaction/new-transaction";
import { DisplayAccountsPage } from "../display-accounts/display-accounts";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { ToastController } from 'ionic-angular';
import { Platform } from 'ionic-angular';




@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  myHtml: any;
  totalUser: any;
  active: string;
  empty = false;
  totalString: any;
  allTotal = 0;
  msg: string;
  totalCredit =null;
  totalDebit=null;
  results = [];
  currentTab: String = "Debit";
  total = 0;
  addAccount = AddAccountPage;

  allAccounts = DisplayAccountsPage;
  settings = SettingsPage;

  constructor(public navCtrl: NavController, private sqlite: SQLite,private toastCtrl: ToastController,private ele:ElementRef,private renderer:Renderer2,private plt:Platform) {}
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'bottom',
      showCloseButton : true,
      closeButtonText : "OK"
    });
  
    toast.onDidDismiss(() => {
      if(this.plt.is('ios')){
        this.myHtml=this.ele.nativeElement.getElementsByClassName('overlay')[0];
        this.renderer.removeClass(this.myHtml,'overlay')
        this.renderer.addClass(this.myHtml,'cover')
      }
      
      console.log('Dismissed toast');
    });
  
    toast.present();
  }
  getDebitData() {
    this.active="Debit"
    this.total = this.totalDebit;
    this.currentTab = "Debit";
    this.sqlite
      .create({
        name: "ledgerdb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        return db.executeSql(
          "select mc.aid,mc.aname,mc.phone,mc.descritpion, md.ddate,md.damount from mydebit as md , myaccount as mc where mc.aid=md.aid",
          []
        );
      })
      .then(data => {
        this.results = [];
        console.log(data.rows.length);
        for (let i = 0; i < data.rows.length; i++) {
          console.log(data.rows.item(i).amount);
          this.results.push({
            id: data.rows.item(i).aid,
            name: data.rows.item(i).aname,
            amount: data.rows.item(i).damount,
            date: data.rows.item(i).ddate,
            phone: data.rows.item(i).phone,
            descritpion: data.rows.item(i).descritpion
          });
        }
        if(this.totalDebit == null)  {
          this.empty = true;
          this.msg ="No Transaction To Show"
        }
        else {
          this.empty = false;
        }
      })
      .then(() => console.log("Executed SQL"))
      .catch(e => console.log("Error In Credit " + JSON.stringify(e)));
  }
  getCreditData() {
    this.active="Credit"
    this.total = this.totalCredit;
    this.currentTab = "Credit";
    this.sqlite
      .create({
        name: "ledgerdb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        return db.executeSql(
          "select mc.aid,mc.aname, mc.phone,mc.descritpion, cd.cdate,cd.camount from mycredit as cd , myaccount as mc where mc.aid=cd.aid",
          []
        );
      })
      .then(data => {
        this.results = [];
        console.log(data.rows.length);
        for (let i = 0; i < data.rows.length; i++) {
          console.log(data.rows.item(i).cmount);
          this.results.push({
            id: data.rows.item(i).aid,
            name: data.rows.item(i).aname,
            amount: data.rows.item(i).camount,
            date: data.rows.item(i).cdate,
            phone: data.rows.item(i).phone,
            descritpion: data.rows.item(i).descritpion
          });
        }
        if(this.totalCredit == null)  {
          this.empty = true;
          this.msg ="No Transaction To Show"
        }
        else {
          this.empty = false;
        }
      })
      .then(() => console.log("Executed SQL"))
      .catch(e => console.log("Error In Credit " + JSON.stringify(e)));

    this.sqlite
      .create({
        name: "ledgerdb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        return db.executeSql(
          "select sum(camount) as debit_total from mycredit ",
          []
        );
      })
      .then(data => {
        for (let i = 0; i < data.rows.length; i++) {
          console.log(data.rows.item(i).debit_total);
          this.totalCredit = data.rows.item(i).debit_total;
          this.total = this.totalCredit;
        }
      })
      .then(() => console.log("WE GOT THE TOTAL DEBIT"))
      .catch(e => console.log(JSON.stringify(e)));
    this.total = this.totalCredit;
  }

  ionViewDidLoad() {
    this.active="Debit"
    this.getData();
    this.getDebitData();
    this.sqlite
    .create({
      name: "ledgerdb.db",
      location: "default"
    })
    .then((db: SQLiteObject) => {
      return db.executeSql(
        "select count(*) as total from myaccount ",
        []
      );
    })
    .then(data => {
      for (let i = 0; i < data.rows.length; i++) {
        console.log(data.rows.item(i).total);
        this.totalUser = data.rows.item(i).total;
        console.log("TTOTAL USER "+this.totalUser);
      }
    })
    .then(() => console.log("WE GOT THE TOTAL DEBIT"))
    .catch(e => console.log(JSON.stringify(e)));
    this.sqlite
      .create({
        name: "ledgerdb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        return db.executeSql(
          "select sum(camount) as debit_total from mycredit ",
          []
        );
      })
      .then(data => {
        for (let i = 0; i < data.rows.length; i++) {
          console.log(data.rows.item(i).debit_total);
          this.totalCredit = data.rows.item(i).debit_total;
          this.total = this.totalCredit;
          console.log(this.totalCredit);
        }
      })
      .then(() => console.log("WE GOT THE TOTAL DEBIT"))
      .catch(e => console.log(JSON.stringify(e)));

    this.sqlite
      .create({
        name: "ledgerdb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        return db.executeSql(
          "select sum(damount) as debit_total from mydebit ",
          []
        );
      })
      .then(data => {
        for (let i = 0; i < data.rows.length; i++) {
          console.log(data.rows.item(i).debit_total);
          this.totalDebit = data.rows.item(i).debit_total;

          console.log(this.totalDebit);
          this.total = this.totalDebit;
        }
        this.allTotal = this.totalCredit - this.totalDebit;
        if (this.allTotal < 0) {
          this.allTotal -= this.allTotal * 2;
        }

        this.totalString = this.allTotal.toString();
        console.log(this.totalString.length);
      })
      .then(() => console.log("WE GOT THE TOTAL DEBIT"))
      .catch(e => console.log(JSON.stringify(e)));
  }

  ionViewWillEnter() {
    this.active="Debit"
    this.getDebitData();
    this.sqlite
    .create({
      name: "ledgerdb.db",
      location: "default"
    })
    .then((db: SQLiteObject) => {
      return db.executeSql(
        "select count(*) as total from myaccount ",
        []
      );
    })
    .then(data => {
      for (let i = 0; i < data.rows.length; i++) {
        console.log(data.rows.item(i).total);
        this.totalUser = data.rows.item(i).total;
        console.log("TTOTAL USER "+this.totalUser);
      }
    })
    .then(() => console.log("WE GOT THE TOTAL DEBIT"))
    .catch(e => console.log(JSON.stringify(e)));
    this.sqlite
      .create({
        name: "ledgerdb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        return db.executeSql(
          "select sum(damount) as debit_total from mydebit ",
          []
        );
      })
      .then(data => {
        for (let i = 0; i < data.rows.length; i++) {
          console.log(data.rows.item(i).debit_total);
          this.totalDebit = data.rows.item(i).debit_total;
          this.total = this.totalDebit;
        }
      })
      .then(() => console.log("WE GOT THE TOTAL DEBIT"))
      .catch(e => console.log(JSON.stringify(e)));

    this.sqlite
      .create({
        name: "ledgerdb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        return db.executeSql(
          "select sum(camount) as debit_total from mycredit ",
          []
        );
      })
      .then(data => {
        for (let i = 0; i < data.rows.length; i++) {
          console.log(data.rows.item(i).debit_total);
          this.totalCredit = data.rows.item(i).debit_total;
          console.log(this.totalCredit);
          this.allTotal = this.totalCredit - this.totalDebit;
          if (this.allTotal < 0) {
            this.allTotal -= this.allTotal * 2;
          }
        }
        console.log(this.totalDebit);
        if(this.totalDebit == null)  {
          this.empty = true;
          this.msg ="No Transaction To Show"
        } else {
          this.empty = false;
        }
        if (this.totalUser <=0 ) {
          this.empty = true;
          this.msg ="No Transaction To Show"
        }
        else {
          this.empty = false
        }
      })
      .then(() => console.log("WE GOT THE TOTAL DEBIT"))
      .catch(e => console.log(JSON.stringify(e)));

    console.log(this.results.length);
    
  }

  getData() {
    this.sqlite
          .create({
        name: "ledgerdb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        db.executeSql(
          "CREATE TABLE IF NOT EXISTS myaccount (aid INTEGER PRIMARY KEY AUTOINCREMENT , aname , phone , descritpion)",
          []
        )
          .then(() => console.log("Executed SQL"))
          .catch(e => console.log(JSON.stringify(e)));
        db.executeSql(
          "CREATE TABLE IF NOT EXISTS mytransaction(tid INTEGER PRIMARY KEY AUTOINCREMENT , aid INTEGER ,tamount , tdate , descritpion,FOREIGN KEY(aid) REFERENCES myaccount (aid))",
          []
        )
          .then(() => console.log("did Executed SQL"))
          .catch(e => console.log(JSON.stringify(e)));
      });
  }

  nextPage(id,name,phone,amount){
    this.navCtrl.push(DetailpagePage,{
      'id' : id,
      'userName' : name,
      'amount' : amount ,
      'phone' : phone,
      'active' : this.active
    })
  }

  addTransactionPage(){
    if(this.plt.is('ios')){
      if (this.totalUser <=0 ) {
        this.presentToast('Please Add The User First Before Adding Any New Transaction.You Can Add New User By Clicking The ICON on Top')
          this.myHtml=this.ele.nativeElement.getElementsByClassName('cover')[0];
          this.renderer.addClass(this.myHtml,'overlay')
          

      }
      else {
        this.navCtrl.push(NewTransactionPage);
      }
    } else {
      if (this.totalUser <=0 ) {
        this.empty = true;
        this.presentToast('Please Add The User First Before Adding Any New Transaction.You Can Add New User By Clicking The ICON in Top left Corner.')
      }
      else {
        this.navCtrl.push(NewTransactionPage);
      }
    }
    
  }
}
