import { Component } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';

@Component({
  selector: 'app-pendingevents',
  templateUrl: './pendingevents.component.html',
  styleUrls: ['./pendingevents.component.scss']
})
export class PendingeventsComponent {

  pendingEvents!:Observable<DocumentData[]>;
  filteredList:any;
  // usersMap = new Map();

  // constructor(private readonly _dbLoader:DbaccessService, private readonly _router: Router){ }
  constructor(private readonly _dbAccess: AngularfireService, private readonly _router: Router){ }

  async loadData(){
    this.pendingEvents = await this._dbAccess.getEvents();

    this.pendingEvents.forEach((e:any)=> {
      this._dbAccess.getUser(e.creator).then((creatorName:any)=>
        // this.usersMap.set(e.creator,creatorName.firstname)
        e.creator = creatorName.firstname
      );

      e.users.forEach((userId:any,index:number) => {
        this._dbAccess.getUser(userId).then((userName:any)=>{
          if(userName !== undefined)
            e.users[index] = userName.firstname;
            // this.usersMap.set(userId,userName.firstname)
        });
      });

      this._dbAccess.getActivity(e.activity).then((activityName:any) =>
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
    this.filteredList = this.pendingEvents.pipe(
      map(
        (e:any) => { return e
        .filter(
          (e:{activity:string,creator:string,title:string,description:string})=>
            e.activity.toLowerCase().includes(searchItem) ||
            e.creator.toLowerCase().includes(searchItem) ||
            e.title.toLowerCase().includes(searchItem)
        );
        }
      )
    )
  }
}
