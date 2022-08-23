import { AfterViewInit, Component } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, firstValueFrom, map, Observable } from 'rxjs';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';
import localeFr from '@angular/common/locales/fr';
import { DatePipe } from '@angular/common';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-pendingevents',
  templateUrl: './pendingevents.component.html',
  styleUrls: ['./pendingevents.component.scss']
})
export class PendingeventsComponent implements AfterViewInit{

  // pendingEvents:Observable<DocumentData[]> = this._dbAccess.getEvents();
  pendingEvents:Observable<DocumentData[]> = this._dbAccess.getUpToDateEvents();
  searchQ = new BehaviorSubject(null as any);
  activities!:any;
  activitiesNames = new Map();
  creatorsNames = new Map();

  constructor(private readonly _dbAccess: AngularfireService, 
    private readonly _router: Router,
    private readonly _auth: Auth){ }

  ngAfterViewInit(): void {
    this.loadData();
  }

  async loadData(){
    // TODO fix bug that will happen when an event will be created with a name still not loaded
    this.activities = await firstValueFrom(this._dbAccess.getActivities());

    this.activities.forEach((e:{id:string,name:string})=>{
      this.activitiesNames.set(e.id,e.name);
    });
  }

  filteredPendingEvents = combineLatest([
    this.pendingEvents,
    this.searchQ.asObservable()
  ]).pipe(
    map(observables => {
      const aL = observables[0]
      .filter(async (elem:any) =>{
        let tempUser = await this._dbAccess.getUser(elem['creatorId']);
        if(tempUser){
          this.creatorsNames.set(elem['creatorId'],tempUser['name'])
        }else{
          this.creatorsNames.set(elem['creatorId'],"anonymous")
        }
        return parseInt(elem['date']) > Date.now()
      });

      const sQ: any = observables[1];

      if (!sQ) {
        return aL
      }
      const pipe = new DatePipe("fr-CH");
      return aL
      .filter((elem:any) =>
      // {
        // console.log("elem : ",elem);
        // console.log("creator name : ",this.creatorsNames.get(elem['creatorId']));
        // console.log("all names : ",this.creatorsNames);
      // return elem['name'].toLowerCase().includes(sQ.toLowerCase()) 
        elem['name'].toLowerCase().includes(sQ.toLowerCase()) 
        || elem['description'].toLowerCase().includes(sQ.toLowerCase()) 
        || this.creatorsNames.get(elem['creatorId']).toLowerCase().includes(sQ.toLowerCase())
        // Doesnt work
        || pipe.transform(elem['date']||"",'H:mm dd.MM.y')?.toLowerCase().includes(sQ.toLowerCase())
        // || DatePipe.apply(elem['date'],'H:mm dd.MM.y')
      // }
      )
    })
  );

  isUserAttending(attendantsId:string[]):boolean{
    if(!this._auth.currentUser)
      return false;
    return attendantsId.includes(this._auth.currentUser.uid);
  }

  navigateToEventDetail(param:string){
    this._router.navigate(["event"],{queryParams:{eventId:param}});
  }

  updateSearchValue($event:any){
    this.searchQ.next($event.target.value);
  }

  async handleEnterKey($event:any){
    console.log("enter pressed");

    // TODO go to detail event if there is only 1 left
    const choosenItem = await firstValueFrom(this.filteredPendingEvents);
    if(choosenItem.length === 1){
      this.navigateToEventDetail(choosenItem[0]['id']);
    }

    // this.filteredPendingEvents.pipe(map((e:any) => {
    //   console.log("elem",e);
    //   if(e.length === 1)
    //     console.log("navigate to event ",e[0]);
    //   return e;
    // }))
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