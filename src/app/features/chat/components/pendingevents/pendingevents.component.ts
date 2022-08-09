import { Component } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';

@Component({
  selector: 'app-pendingevents',
  templateUrl: './pendingevents.component.html',
  styleUrls: ['./pendingevents.component.scss']
})
export class PendingeventsComponent{

  constructor(private readonly _dbAccess: AngularfireService, private readonly _router: Router){ }

  pendingEvents:Observable<DocumentData[]> = this._dbAccess.getEvents();
  searchQ = new BehaviorSubject(null as any);

  filteredPendingEvents = combineLatest([
    this.pendingEvents,
    this.searchQ.asObservable()
  ]).pipe(
    map(observables => {
      const aL = observables[0];
      const sQ: any = observables[1];
      if (!sQ) {
        return aL;
      }
      return aL.filter((elem:any) => elem['name'].toLowerCase().includes(sQ.toLowerCase()));
    })
  );

  navigateToEventDetail(param:Event){
    this._router.navigate(["event"],{queryParams:{eventId:param}});
  }

  updateSearchValue($event:any){
    this.searchQ.next($event.target.value);
  }
}

// this.pendingEvents.forEach((e:any)=> {
//   this._dbAccess.getUser(e.creator).then((creatorName:any)=>
//     // this.usersMap.set(e.creator,creatorName.firstname)
//     e.creator = creatorName.firstname
//   );

//   e.users.forEach((userId:any,index:number) => {
//     this._dbAccess.getUser(userId).then((userName:any)=>{
//       if(userName !== undefined)
//         e.users[index] = userName.firstname;
//         // this.usersMap.set(userId,userName.firstname)
//     });
//   });

//   this._dbAccess.getActivity(e.activity).then((activityName:any) =>
//   // this.activityMap.set(e.activity,activityName.name)
//     e.activity = activityName.name
//   )
// });