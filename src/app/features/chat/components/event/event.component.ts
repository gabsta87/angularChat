import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DbaccessService } from 'src/app/shared/service/dbaccess.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent {

  eventId!:string;
  eventContent!:any;
  creatorName!:any;
  activity!:any;

  constructor(private readonly _dataLoader: DbaccessService, private readonly _route: ActivatedRoute){
  }

  ionViewWillEnter(){
    this.eventId = this._route.snapshot.queryParams["eventId"];
    this.loadData();
  }

  async loadData(){
    this.eventContent = await this._dataLoader.getEvent(String(this.eventId));

    this.creatorName = await this._dataLoader.getUser(this.eventContent.creator);

    this.activity = await this._dataLoader.getActivity(this.eventContent.activity);
  }
}
