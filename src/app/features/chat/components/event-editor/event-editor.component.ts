import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';
import { NgForm } from '@angular/forms';

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
  attendants!:any[];
  eventType!:string;
  today!:string;

  async ionViewWillEnter(){
    this.eventData = this._route.snapshot.data['eventData'];
    this.activities = await firstValueFrom(this._dbAccess.getActivities());

    this.eventTitle = this.eventData.name;
    if(this.eventData.date)
      this.eventDate = new Date(this.eventData.date).toISOString();
    this.eventDescription = this.eventData.description;
    if(this.eventData.attendants === undefined){
      this.attendants = this.eventData.attendants;
    }else{
      this.attendants = []
    }
    this.eventType = this.eventData.activityId;
    this.today = new Date(Date.now()).toISOString();

    console.log("date : ",this.eventDate);
    console.log("data : ",this.eventData);
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
    console.log("creating event : ",this.eventData);

    // create event
    let event = {
      name:this.eventTitle,
      activityId:this.eventType,
      attendantsId:this.attendants.flatMap((e:{id:string})=> e.id),
      description:this.eventDescription,
      date:this.eventDate,
      timeStamp:0,
      position: { latitude:this.eventData.position.latitude, longitude: this.eventData.position.longitude},
    }
    if(!event.attendantsId)
      event.attendantsId=[];

    if(!event.date){
      alert("invalid date")
      return;
    }
    event.timeStamp = new Date(event.date).getTime(),

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
