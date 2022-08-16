import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-event-editor',
  templateUrl: './event-editor.component.html',
  styleUrls: ['./event-editor.component.scss']
})
export class EventEditorComponent implements OnInit {

  parentPage!:string;

  activities!:any;
  eventLatitude!:number;
  eventLongitude!:number;

  eventTitle!:string;
  eventType!:string;
  eventDescription!:string;
  eventDate!:string;

  constructor(
    private readonly _dbAccess: AngularfireService, 
    private readonly _router: Router,
    private readonly _route:ActivatedRoute
    ){ }

  async ngOnInit(){
    await this.loadData();
  }

  ionViewWillEnter(){
    console.log("snap : ",this._route.snapshot);
    
    this.eventLatitude = this._route.snapshot.queryParams["latitude"];
    this.eventLongitude = this._route.snapshot.queryParams["longitude"];
    console.log("event location : ",this.eventLatitude,",",this.eventLongitude);
    console.log("activities ",this.activities);
  }

  async loadData(){
    this.activities = await firstValueFrom(this._dbAccess.getActivities());
  }

  cancelAction(){
    this._router.navigate(["pendingevents"]);
  }

  confirmAction(){
    // createEvent
    let event = { 
      name:this.eventTitle, 
      // activityId:this.eventType, 
      activityId:"GhptY7fTM4Ak3JqRlfbm", 
      description:this.eventDescription, 
      date:this.eventDate, 
      position: { latitude:this.eventLatitude, longitude: this.eventLongitude} 
    }
    console.log("TODO : change activityID - creating event ",event);
    
    this._dbAccess.createEvent(event)
    this._router.navigate(["pendingevents"]);
  }

  keyboardManagement($event:any){
    console.log("event : ",$event);
    if($event.keyCode === 27){
      console.log("do shit");
    }
  }
}
