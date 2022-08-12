import { AfterViewInit, Component } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, firstValueFrom, map, Observable } from 'rxjs';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';

@Component({
  selector: 'app-pendingevents',
  templateUrl: './pendingevents.component.html',
  styleUrls: ['./pendingevents.component.scss']
})
export class PendingeventsComponent implements AfterViewInit{
  
    pendingEvents:Observable<DocumentData[]> = this._dbAccess.getEvents();
    searchQ = new BehaviorSubject(null as any);
    activities!:any;
    userNames = new Map();

  constructor(private readonly _dbAccess: AngularfireService, private readonly _router: Router){ }

  ngAfterViewInit(): void {
    this.loadData();
  }

  async loadData(){
    console.log("loading data");
    
    // TODO fix bug that will happen when an event will be created with a name still not loaded
    this.activities = await firstValueFrom(this._dbAccess.getActivities());

    console.log("activities : ",this.activities);
    
    this.pendingEvents.pipe(map((e:any)=>{
      console.log("e : ",e);
      
      e.forEach(
        // this.userNames.set()
      )
    }))
  }

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

  navigateToEventDetail(param:string){
    this._router.navigate(["event"],{queryParams:{eventId:param}});
  }

  updateSearchValue($event:any){
    this.searchQ.next($event.target.value);
  }

  handleEnterKey($event:any){
    console.log("enter pressed");
    
    // TODO go to detail event if there is only 1 left
    this.filteredPendingEvents.pipe(map((e:any) => {
      console.log("elem",e);
      if(e.length === 1)
        console.log("navigate to event ",e[0]);
        
      return e;
    }))
  }

  handleEscKey($event:any){
    $event.target.value = "";
    this.updateSearchValue($event);
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