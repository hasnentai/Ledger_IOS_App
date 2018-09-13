import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { ToastController } from "ionic-angular";

/**
 * Generated class for the NewTransactionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-new-transaction",
  templateUrl: "new-transaction.html"
})
export class NewTransactionPage {
  results: any[];
  mydata = -1;
  query;
  userDebit;
  userCredit;
  accountData = {
    dec: "",
    amount: "",
    aname: ""
  };
  myDate: String = new Date().toISOString();
  public event = {
    month: this.myDate,
    timeStarts: "07:43",
    timeEnds: "1990-02-20"
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public sqlite: SQLite,
    private toastCtrl: ToastController
  ) {}
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: "top"
    });

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    toast.present();
  }
  ionViewDidLoad() {
    console.log("ionViewDidLoad NewTransactionPage");
    this.createCredit();
    this.createDebit();
    this.getData();
  }

  getData() {
    this.sqlite
      .create({
        name: "ledgerdb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        return db.executeSql("select aid,aname from myaccount", []);
      })
      .then(data => {
        this.results = [];
        for (let i = 0; i < data.rows.length; i++) {
          console.log(data.rows.item(i).phone);
          let aid = data.rows.item(i).aid;
          let aname = data.rows.item(i).aname;
          this.results.push({
            aid: aid,
            aname: aname
          });
        }
      })
      .catch(e => console.log("You Got This Errro" + JSON.stringify(e)));
    console.log(this.results);
  }

  insertDebitData() {
    this.sqlite
      .create({
        name: "ledgerdb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        db.executeSql(
          "INSERT INTO mydebit (aid,ddate,damount,ddecp) VALUES (?,?,?,?)",
          [
            this.mydata,
            this.event.month,
            this.accountData.amount,
            this.accountData.dec
          ]
        )
          .then(() => console.log("DEBIT Executed SQL"))
          .catch(e => console.log(JSON.stringify(e)));
      })
      .then(() => {
        console.log(" check  done Executed SQL");
        this.presentToast("Transaction was added successfully");
      })
      .catch(e => {
        console.log("Error In Credit " + JSON.stringify(e));
        this.presentToast("Somthing went wrong");
      });
  }

  insertCreditData() {
    this.sqlite
      .create({
        name: "ledgerdb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        db.executeSql(
          "INSERT INTO mycredit (aid,cdate,camount,cdecp) VALUES (?,?,?,?)",
          [
            this.mydata,
            this.event.month,
            this.accountData.amount,
            this.accountData.dec
          ]
        )
          .then(() => console.log("CREDIT Executed SQL"))
          .catch(e => console.log(JSON.stringify(e)));
      })
      .then(() => {
        console.log(" check  done Executed SQL");
        this.presentToast("Transaction was added successfully");
      })
      .catch(e => {
        console.log("Error In Credit " + JSON.stringify(e));
        this.presentToast("Somthing went wrong");
      });
  }
  createDebit() {
    this.sqlite
      .create({
        name: "ledgerdb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        db.executeSql(
          "CREATE TABLE IF NOT EXISTS mydebit(did INTEGER PRIMARY KEY AUTOINCREMENT,aid,ddate,damount,ddecp,FOREIGN KEY(aid) REFERENCES myaccount (aid))",
          []
        )
          .then(() => console.log("Debit" + "Executed SQL"))
          .catch(e => console.log("Error In Debit " + JSON.stringify(e)));
      });
  }

  createCredit() {
    this.sqlite
      .create({
        name: "ledgerdb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        db.executeSql(
          "CREATE TABLE IF NOT EXISTS mycredit(cid INTEGER PRIMARY KEY AUTOINCREMENT,aid,cdate,camount,cdecp,FOREIGN KEY(aid) REFERENCES myaccount (aid))",
          []
        )
          .then(() => console.log("Credit" + "Executed SQL"))
          .catch(e => console.log("Error In Credit " + JSON.stringify(e)));
      });
  }

  async checkFirstUserDebit() {
    this.sqlite
      .create({
        name: "ledgerdb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        return db.executeSql(
          "select count(*) as TOTAL  from mydebit where aid = ?",
          [this.mydata]
        );
      })
      .then(data => {
        let total;
        for (let i = 0; i < data.rows.length; i++) {
          total = parseInt(data.rows.item(i).TOTAL);
        }
        console.log("total " + total);
        if (total > 0) {
          this.userDebit = true;
          this.sqlite
            .create({
              name: "ledgerdb.db",
              location: "default"
            })
            .then((db: SQLiteObject) => {
              return db
                .executeSql(
                  "select sum(damount) as TOTAL from mydebit where aid = ?",
                  [this.mydata]
                )
                .then(data => {
                  let debitSum = 0;
                  for (let i = 0; i < data.rows.length; i++) {
                    console.log("THE DATA IS " + data.rows.item(i).TOTAL);
                    debitSum =
                      parseInt(data.rows.item(i).TOTAL) +
                      parseInt(this.accountData.amount);
                  }
                  this.sqlite
                    .create({
                      name: "ledgerdb.db",
                      location: "default"
                    })
                    .then((db: SQLiteObject) => {
                      db.executeSql(
                        "Update mydebit set damount = ? where aid = ?",
                        [debitSum.toString(), this.mydata]
                      );
                    })
                    .then(() => console.log("DONE"))
                    .catch(e => console.log("Some thing wrong update " + e));
                })
                .then(() => console.log("LOOK"))
                .catch(e => console.log(JSON.stringify(e)));
            });
        } else {
          this.userDebit = false;
          this.sqlite
            .create({
              name: "ledgerdb.db",
              location: "default"
            })
            .then((db: SQLiteObject) => {
              return db.executeSql(
                "select count(*) AS TOTAL from mycredit where aid = ?",
                [this.mydata]
              );
            })
            .then(data => {
              let total;
              for (let i = 0; i < data.rows.length; i++) {
                total = parseInt(data.rows.item(i).TOTAL);
              }
              if (total > 0) {
                this.userCredit = true;
                this.sqlite
                  .create({
                    name: "ledgerdb.db",
                    location: "default"
                  })
                  .then((db: SQLiteObject) => {
                    return db
                      .executeSql(
                        "select sum(camount) as TOTAL from mycredit where aid = ?",
                        [this.mydata]
                      )
                      .then(data => {
                        let creditSum = 0;
                        for (let i = 0; i < data.rows.length; i++) {
                          console.log("THE DATA IS " + data.rows.item(i).TOTAL);
                          creditSum =
                            parseInt(data.rows.item(i).TOTAL) -
                            parseInt(this.accountData.amount);
                        }
                        if (creditSum < 0) {
                          creditSum -= creditSum * 2;
                          this.sqlite
                            .create({
                              name: "ledgerdb.db",
                              location: "default"
                            })
                            .then((db: SQLiteObject) => {
                              db.executeSql(
                                "INSERT INTO mydebit (aid,ddate,damount,ddecp) SELECT aid,cdate,camount,cdecp FROM mycredit where aid = ?",
                                [this.mydata]
                              );
                              this.sqlite
                                .create({
                                  name: "ledgerdb.db",
                                  location: "default"
                                })
                                .then((db: SQLiteObject) => {
                                  db.executeSql(
                                    "delete from mycredit where aid=?",
                                    [this.mydata]
                                  );
                                  this.sqlite
                                    .create({
                                      name: "ledgerdb.db",
                                      location: "default"
                                    })
                                    .then((db: SQLiteObject) => {
                                      db.executeSql(
                                        "update  mydebit set damount = ? where aid=?",
                                        [creditSum.toString(), this.mydata]
                                      );
                                    });
                                });
                            })
                            .then(() => console.log("DONE"))
                            .catch(e =>
                              console.log("Some thing wrong update " + e)
                            );
                          return console.log("Going OUt");
                        }

                        if (creditSum == 0) {
                          this.sqlite
                            .create({
                              name: "ledgerdb.db",
                              location: "default"
                            })
                            .then((db: SQLiteObject) => {
                              db.executeSql(
                                "delete from mycredit where aid=?",
                                [this.mydata]
                              );
                            });
                          return console.log("ZERO GOING OUT");
                        }
                        this.sqlite
                          .create({
                            name: "ledgerdb.db",
                            location: "default"
                          })
                          .then((db: SQLiteObject) => {
                            db.executeSql(
                              "Update mycredit set camount = ? where aid = ?",
                              [creditSum.toString(), this.mydata]
                            );
                          })
                          .then(() => console.log("DONE"))
                          .catch(e =>
                            console.log("Some thing wrong update " + e)
                          );
                      })
                      .then(() => console.log("LOOK"))
                      .catch(e => console.log(JSON.stringify(e)));
                  });
              } else {
                this.userCredit = false;
                this.insertDebitData();
              }
            })
            .then(() => console.log("Executed SQL"))
            .catch(e => console.log("Error In Credit " + JSON.parse(e)));
          //this.insertDebitData();
        }
      })
      .then(() => {
        console.log(" check  done Executed SQL");
        this.presentToast("Transaction was added successfully");
      })
      .catch(e => {
        console.log("Error In Credit " + JSON.stringify(e));
        this.presentToast("Somthing went wrong");
      });
  }

  async checkFirstUserCredit() {
    this.sqlite
      .create({
        name: "ledgerdb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        return db.executeSql(
          "select count(*) as TOTAL  from mycredit where aid = ?",
          [this.mydata]
        );
      })
      .then(data => {
        let total;
        for (let i = 0; i < data.rows.length; i++) {
          total = parseInt(data.rows.item(i).TOTAL);
        }
        console.log("total " + total);
        if (total > 0) {
          this.userDebit = true;
          this.sqlite
            .create({
              name: "ledgerdb.db",
              location: "default"
            })
            .then((db: SQLiteObject) => {
              return db
                .executeSql(
                  "select sum(camount) as TOTAL from mycredit where aid = ?",
                  [this.mydata]
                )
                .then(data => {
                  let debitSum = 0;
                  for (let i = 0; i < data.rows.length; i++) {
                    console.log("THE DATA IS " + data.rows.item(i).TOTAL);
                    debitSum =
                      parseInt(data.rows.item(i).TOTAL) +
                      parseInt(this.accountData.amount);
                  }
                  this.sqlite
                    .create({
                      name: "ledgerdb.db",
                      location: "default"
                    })
                    .then((db: SQLiteObject) => {
                      db.executeSql(
                        "Update mycredit set camount = ? where aid = ?",
                        [debitSum.toString(), this.mydata]
                      );
                    })
                    .then(() => console.log("DONE"))
                    .catch(e => console.log("Some thing wrong update " + e));
                })
                .then(() => console.log("LOOK"))
                .catch(e => console.log(JSON.stringify(e)));
            });
        } else {
          this.userDebit = false;
          this.sqlite
            .create({
              name: "ledgerdb.db",
              location: "default"
            })
            .then((db: SQLiteObject) => {
              return db.executeSql(
                "select count(*) AS TOTAL from mydebit where aid = ?",
                [this.mydata]
              );
            })
            .then(data => {
              let total;
              for (let i = 0; i < data.rows.length; i++) {
                total = parseInt(data.rows.item(i).TOTAL);
              }
              if (total > 0) {
                this.userCredit = true;
                this.sqlite
                  .create({
                    name: "ledgerdb.db",
                    location: "default"
                  })
                  .then((db: SQLiteObject) => {
                    return db
                      .executeSql(
                        "select sum(damount) as TOTAL from mydebit where aid = ?",
                        [this.mydata]
                      )
                      .then(data => {
                        let creditSum = 0;
                        for (let i = 0; i < data.rows.length; i++) {
                          console.log("THE DATA IS " + data.rows.item(i).TOTAL);
                          console.log("Length IS " + data.rows.length);
                          console.log(
                            "TEXT BOX DATA IS " + this.accountData.amount
                          );
                          creditSum =
                            parseInt(data.rows.item(i).TOTAL) -
                            parseInt(this.accountData.amount);
                        }
                        if (creditSum < 0) {
                          creditSum -= creditSum * 2;
                          this.sqlite
                            .create({
                              name: "ledgerdb.db",
                              location: "default"
                            })
                            .then((db: SQLiteObject) => {
                              db.executeSql(
                                "INSERT INTO mycredit (aid,cdate,camount,cdecp) SELECT aid,ddate,damount,ddecp FROM mydebit where aid = ?",
                                [this.mydata]
                              );
                              this.sqlite
                                .create({
                                  name: "ledgerdb.db",
                                  location: "default"
                                })
                                .then((db: SQLiteObject) => {
                                  db.executeSql(
                                    "delete from mydebit where aid=?",
                                    [this.mydata]
                                  );
                                  this.sqlite
                                    .create({
                                      name: "ledgerdb.db",
                                      location: "default"
                                    })
                                    .then((db: SQLiteObject) => {
                                      db.executeSql(
                                        "update  mycredit set camount = ? where aid=?",
                                        [creditSum.toString(), this.mydata]
                                      );
                                    });
                                });
                            })
                            .then(() => console.log("DONE"))
                            .catch(e =>
                              console.log("Some thing wrong update " + e)
                            );
                          return console.log("Going OUt");
                        }
                        if (creditSum == 0) {
                          this.sqlite
                            .create({
                              name: "ledgerdb.db",
                              location: "default"
                            })
                            .then((db: SQLiteObject) => {
                              db.executeSql("delete from mydebit where aid=?", [
                                this.mydata
                              ]);
                            });
                          return console.log("ZERO GOING OUT");
                        }
                        this.sqlite
                          .create({
                            name: "ledgerdb.db",
                            location: "default"
                          })
                          .then((db: SQLiteObject) => {
                            db.executeSql(
                              "Update mydebit set damount = ? where aid = ?",
                              [creditSum.toString(), this.mydata]
                            );
                          })
                          .then(() => console.log("DONE"))
                          .catch(e =>
                            console.log("Some thing wrong update " + e)
                          );
                      })
                      .then(() => console.log("LOOK"))
                      .catch(e => console.log(JSON.stringify(e)));
                  });
              } else {
                this.userCredit = false;
                this.insertCreditData();
              }
            })
            .then(() => console.log("Executed SQL"))
            .catch(e => console.log("Error In Credit " + JSON.parse(e)));
          //this.insertDebitData();
        }
      })
      .then(() => {
        console.log(" check  done Executed SQL");
        this.presentToast("Transaction was added successfully");
      })
      .catch(e => {
        console.log("Error In Credit " + JSON.stringify(e));
        this.presentToast("Somthing went wrong");
      });
  }

  debitData() {
    let transaction = "Dr"
    if (this.mydata == -1) {
      this.presentToast("Please Select the Name");
    } else if (this.accountData.amount == "") {
      this.presentToast("Please Enter the Amount");
    } else {
      this.createDebit();
      this.checkFirstUserDebit();
      this.sqlite
      .create({
        name: "ledgerdb.db",
        location: "default"
      })
      .then((db: SQLiteObject)=> {
        db.executeSql("INSERT INTO mytransaction (aid,tamount,tdate,descritpion) VALUES (?,?,?,?)",[this.mydata,this.accountData.amount,this.event.month,transaction])
      })
      .then(() => {console.log("WE DID IT")})
      .catch((e) => { console.log(e)})
    }
  }
  creditData() {
    let transaction = "Cr"
    if (this.mydata == -1) {
      this.presentToast("Please Select the Name");
    } else if (this.accountData.amount == "") {
      this.presentToast("Please Enter the Amount");
    } else {
      this.createCredit();
      this.checkFirstUserCredit();
      this.sqlite
      .create({
        name: "ledgerdb.db",
        location: "default"
      })
      .then((db: SQLiteObject)=> {
        db.executeSql("INSERT INTO mytransaction (aid,tamount,tdate,descritpion) VALUES (?,?,?,?)",[this.mydata,this.accountData.amount,this.event.month,transaction])
      })
      .then(() => {console.log("WE DID IT")})
      .catch((e) => { console.log(e)})
    }
  }
}
