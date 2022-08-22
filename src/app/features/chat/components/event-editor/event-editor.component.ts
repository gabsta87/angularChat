import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';
import { NgForm } from '@angular/forms';
import { Event } from '../../resolvers/event-edition.resolver';
import { DataAccess } from 'src/app/shared/service/dataAccess';

@Component({
  selector: 'app-event-editor',
  templateUrl: './event-editor.component.html',
  styleUrls: ['./event-editor.component.scss']
})
export class EventEditorComponent implements OnInit {

  parentPage!:string;

  eventData!:Event;
  activities!:any;

  eventTitle = this.eventData?.name;
  eventDate = this.eventData?.date;
  eventDescription = this.eventData?.description;
  eventType = this.eventData?.activityName;
  today = new Date(Date.now()).toISOString();

  // Event{
  //   name:string;
  //   id:string;
  //   activityId:string;
  //   activityName:string;
  //   creatorId:string;
  //   creatorName:string;
  //   date:string;
  //   description:string;
  //   timeStamp:number;
  //   position:{latitude:number,longitude:number};
  //   attendants:Map<string,string>;
  // }

  afterViewInit(){
    console.log("after view init");
    console.log("event data : ",this.eventData);
    console.log("activities : ",this.activities);
  }

  async ionViewWillEnter(){
    console.log("Ion will enter");
    this.activities = await firstValueFrom(this._dbAccess.getActivities());
    console.log("event data : ",this.eventData);
    console.log("activities : ",this.activities);
  }

  ngOnInit(): void {
    console.log("on init");
    console.log("event data : ",this.eventData);
    console.log("activities : ",this.activities);
  }

  constructor(
    private readonly _dbAccess: AngularfireService, 
    private readonly _router: Router,
    // private readonly _route:ActivatedRoute,
    // @Inject("MyDataService") private readonly myNewDataService: DataAccess
    ){
      console.log("constructor");
      console.log("event data : ",this.eventData);
      console.log("activities : ",this.activities);
    }

  cancelAction(){
    this.initFields();
    this._router.navigate(["pendingevents"]);
  }

  private initFields(){
    this.eventTitle = "";
    this.eventDate = "";
    this.eventDescription = "";
    this.eventType = "";
    // this.eventData.name = "";
    // this.eventData.description = "";
    // this.eventData.activityId = "";
    // this.eventData.date = "";
  }

  confirmAction(){
    let tempDate = new Date(this.eventData.date).getTime();

// create event
    let event = {
      name:this.eventData.name,
      activityId:this.eventData.activityId,
      attendantsId:this.eventData.attendants.keys(),
      description:this.eventData.description,
      date:this.eventData.date,
      timeStamp:tempDate,
      position: { latitude:this.eventData.position.latitude, longitude: this.eventData.position.longitude},
    }

    if(this.eventData.id){
      // delete old event
      this._dbAccess.deleteEvent(this.eventData.id);
    }
    this._dbAccess.createEvent(event)
    this.initFields();
    this._router.navigate(["pendingevents"]);
  }

  keyboardManagement($event:any){
    console.log("event : ",$event);
    if($event.keyCode === 27){
      console.log("do shit");
    }
  }
}
