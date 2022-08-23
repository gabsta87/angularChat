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
export class EventEditorComponent{

  parentPage!:string;

  eventData!:any;
  activities!:any;

  eventTitle!:string;
  eventDate!:string;
  eventDescription!:string;
  eventType!:string;
  today!:string;

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

  async ionViewWillEnter(){
    this.eventData = this._route.snapshot.data['eventData'];
    this.activities = await firstValueFrom(this._dbAccess.getActivities());
    console.log("event data : ",this.eventData);
    this.eventTitle = this.eventData.name;
    this.eventDate = this.eventData.date;
    this.eventDescription = this.eventData.description;
    this.eventType = this.eventData.activityId;
    this.today = new Date(Date.now()).toISOString();
  }

  constructor(
    private readonly _dbAccess: AngularfireService,
    private readonly _router: Router,
    private readonly _route:ActivatedRoute,
    // @Inject("MyDataService") private readonly myNewDataService: DataAccess
    ){}

  cancelAction(){
    this.initFields();
    this._router.navigate(["pendingevents"]);
  }

  private initFields(){
    this.eventTitle = "";
    this.eventDate = "";
    this.eventDescription = "";
    this.eventType = "";
  }

  confirmAction(){
    console.log("creating event ...");

    console.log("event data : ",this.eventData);
    console.log("eventName : ",this.eventTitle);

// create event
    let event = {
      name:this.eventTitle,
      activityId:this.eventType,
      attendantsId:this.eventData.attendants||[],
      description:this.eventDescription,
      date:this.eventDate,
      timeStamp:new Date(this.eventDate).getTime(),
      position: { latitude:this.eventData.position.latitude, longitude: this.eventData.position.longitude},
    }
    console.log("creating event ",event);
    

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
