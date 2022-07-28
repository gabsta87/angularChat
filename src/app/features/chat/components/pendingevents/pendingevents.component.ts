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
  filteredList:any;
  usersMap = new Map();

  constructor(private readonly _dbLoader:DbaccessService, private readonly _router: Router){
  }

  ngOnInit(): void {
  }

  async loadData(){
    this.pendingEvents = await this._dbLoader.getEvents();

    this.pendingEvents.forEach((e:any)=> {
      console.log("event : ",e);

      this._dbLoader.getUser(e.creator).then((creatorName:any)=>
        this.usersMap.set(e.creator,creatorName.firstname)
      );

      e.users.forEach((userId:any) => {
        console.log("users : ",userId);

        this._dbLoader.getUser(userId).then(
          (userName:any)=>{
            console.log(userName);

        this.usersMap.set(userId,userName)
          }
        );

      });
    });
    console.log("users map : ",this.usersMap);

    // this.activity = await this._dataLoader.getActivity(this.eventContent.activity);

    this.filteredList = this.pendingEvents;
  }

  ionViewWillEnter(){
    this.loadData();
  }

  navigateToEventDetail(param:string){
    this._router.navigate(["event"],{queryParams:{eventId:param}});
  }

  filter(event:any){
    console.log(event);
    console.log(this.pendingEvents);
    // this.filteredList = this.pendingEvents.filter((e:any)=>)
  }
}
