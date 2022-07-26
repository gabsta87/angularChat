import { Component, OnInit } from '@angular/core';
import { DbaccessService } from 'src/app/shared/service/dbaccess.service';

@Component({
  selector: 'app-pendingevents',
  templateUrl: './pendingevents.component.html',
  styleUrls: ['./pendingevents.component.scss']
})
export class PendingeventsComponent implements OnInit {

  pendingEvents!:any[];

  constructor(private readonly _dbLoader:DbaccessService){
  }

  ngOnInit(): void {
  }

  async loadData(){
    this.pendingEvents = await this._dbLoader.getEvents();
  }

  ionViewWillEnter(){
    this.loadData();
    console.log("events = ",this.pendingEvents);
  }

}
