import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DbaccessService } from 'src/app/shared/service/dbaccess.service';

@Component({
  selector: 'app-pendingevents',
  templateUrl: './pendingevents.component.html',
  styleUrls: ['./pendingevents.component.scss']
})
export class PendingeventsComponent {

  pendingEvents!:any[];
  filteredList:any;
  // usersMap = new Map();

  constructor(private readonly _dbLoader:DbaccessService, private readonly _router: Router){
  }

  async loadData(){
    this.pendingEvents = await this._dbLoader.getEvents();

    this.pendingEvents.forEach((e:any)=> {
      this._dbLoader.getUser(e.creator).then((creatorName:any)=>
        // this.usersMap.set(e.creator,creatorName.firstname)
        e.creator = creatorName.firstname
      );

      e.users.forEach((userId:any,index:number) => {
        this._dbLoader.getUser(userId).then((userName:any)=>{
          if(userName !== undefined)
            e.users[index] = userName.firstname;
            // this.usersMap.set(userId,userName.firstname)
        });
      });

      this._dbLoader.getActivity(e.activity).then((activityName:any) =>
      // this.activityMap.set(e.activity,activityName.name)
        e.activity = activityName.name
      )
    });
    this.filteredList = this.pendingEvents;
  }

  ionViewWillEnter(){
    this.loadData();
  }

  navigateToEventDetail(param:string){
    this._router.navigate(["event"],{queryParams:{eventId:param}});
  }

  filter(event:any){
    let searchItem = event.detail.value.toLowerCase();
    this.filteredList = this.pendingEvents.filter(
      (e:{activity:string,creator:string,title:string,description:string})=>
        e.activity.toLowerCase().includes(searchItem) ||
        e.creator.toLowerCase().includes(searchItem) ||
        e.title.toLowerCase().includes(searchItem)
    );
  }
}
