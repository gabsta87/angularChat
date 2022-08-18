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
  eventId!:string;

  activities!:any;
  eventLatitude!:number;
  eventLongitude!:number;

  eventTitle!:string;
  eventType!:string;
  eventDescription!:string;
  eventDate!:string;
  eventAttendantsId!:string[];
  initDate!:string;

  constructor(
    private readonly _dbAccess: AngularfireService, 
    private readonly _router: Router,
    private readonly _route:ActivatedRoute
    ){ }

  async ngOnInit(){
    await this.loadData();
  }

  async ionViewWillEnter(){
    // console.log("snap : ",this._route.snapshot);
    
    this.eventLatitude = this._route.snapshot.queryParams["latitude"];
    this.eventLongitude = this._route.snapshot.queryParams["longitude"];

    this.eventId = this._route.snapshot.queryParams["eventId"];

    if(this.eventId){
      let temp = await firstValueFrom(this._dbAccess.getEvent(this.eventId));
      if(temp){
        this.eventDescription = temp['description'];
        this.eventDate = new Date(temp['date']).toISOString();
        this.eventTitle = temp['name'];
        this.eventType = temp['activityId'];
        this.eventLatitude = temp['position'].latitude;
        this.eventLongitude = temp['position'].longitude;
        this.eventAttendantsId = temp['attendantsId'];
      }
    }
    this.eventDate = new Date(this.eventDate).toISOString();
    console.log("init date : ",this.initDate," event date : ",this.eventDate);
    
  }

  async loadData(){
    this.activities = await firstValueFrom(this._dbAccess.getActivities());
  }

  cancelAction(){
    this._router.navigate(["pendingevents"]);
  }

  confirmAction(){
    let tempDate = new Date(this.eventDate).getTime();

    // console.log("event date : ",this.eventDate," object new Date : ",new Date(this.eventDate));
    // console.log("temp date : ",tempDate," type of ",typeof(tempDate));

// create event
    let event = {
      name:this.eventTitle,
      activityId:this.eventType,
      attendantsID:this.eventId?this.eventAttendantsId:[],
      description:this.eventDescription,
      date:tempDate,
      position: { latitude:this.eventLatitude, longitude: this.eventLongitude},
    }
    if(this.eventId){
      // delete old event
      this._dbAccess.deleteEvent(this.eventId);
    }
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
