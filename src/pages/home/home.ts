import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  names=[
    {
      name : "Hasnen",
      amoutn: "1200",
      date:"12-Sept-18"
    },
    {
      name : "Saumil",
      amoutn: "2000",
      date:"12-Sept-18"
    },
    {
      name : "Mayur",
      amoutn: "200",
      date:"12-Sept-18"
    },
    {
      name : "Juned",
      amoutn: "1200",
      date:"12-Sept-18"
    },
    {
      name : "Uddesh",
      amoutn: "400",
      date:"12-Sept-18"
    },
    {
      name : "Sumana",
      amoutn: "900",
      date:"12-Sept-18"
    },
    {
      name : "Purnima",
      amoutn: "300",
      date:""
    },
    {
      name : "Hasnen",
      amoutn: "200",
      date:""
    },
  ];

  constructor(public navCtrl: NavController) {
  }

}
