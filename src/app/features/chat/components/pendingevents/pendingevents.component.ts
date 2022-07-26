import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbaccessService } from 'src/app/shared/service/dbaccess.service';

@Component({
  selector: 'app-pendingevents',
  templateUrl: './pendingevents.component.html',
  styleUrls: ['./pendingevents.component.scss']
})
export class PendingeventsComponent implements OnInit {

  pendingEvents!:any[];

  constructor(private readonly _dbLoader:DbaccessService, private readonly _route: Router){
  }

  ngOnInit(): void {
  }

  async loadData(){
    this.pendingEvents = await this._dbLoader.getEvents();
  }

  ionViewWillEnter(){
    this.loadData();
  }

  navigateToEventDetail(param:string){
    this._route.navigate(["event"],{queryParams:{eventId:param}});
  }

}
