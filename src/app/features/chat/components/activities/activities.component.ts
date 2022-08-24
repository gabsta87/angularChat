import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, firstValueFrom, map } from 'rxjs';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent{

  searchQ = new BehaviorSubject(null as any);
  activitiesList = this._dbAccess.getActivities();
  pendingRequestsList = this._dbAccess.getPendingRequests();
  searchValue!:string;
  // subscribtions:Map<string,boolean> = new Map();
  subscribtions:boolean[] = [];

  filteredActivitiesList = combineLatest([
    this.activitiesList,
    this.searchQ.asObservable()
  ]).pipe(
    map(observables => {
      const aL = observables[0];
      const sQ: any = observables[1];
      if (!sQ) {
        return aL;
      }
      return aL.filter((elem:any) => elem['name'].toLowerCase().includes(sQ.toLowerCase()))
    })
  );

  filteredPendingRequestsList = combineLatest([
    this.pendingRequestsList,
    this.searchQ.asObservable()
  ]).pipe(
    map(observables => {
      const requestsList = observables[0];
      const searchQuery : any = observables[1];
      if(!searchQuery){
        return requestsList;
      }
      // return requestsList.filter((elem:any) => elem['name'].toLowerCase().includes(searchQuery.toLowerCase()))
      this.subscribtions = [];
      return requestsList.filter((elem:any) => {
        let value = elem['name'].toLowerCase().includes(searchQuery.toLowerCase());
        if(this._auth.currentUser?.uid && value){
          this.subscribtions.push(elem.attendantsId.includes(this._auth.currentUser.uid))
        }
        return value;
      })
    })
  );

  isEmptyRequests$ = this.filteredPendingRequestsList.pipe(
    map(data => {
      if (data?.length||0 > 0){
        return false
      } else {
        return true
      }
    })
  );

  isEmptyActivities$ = this.filteredActivitiesList.pipe(
    map(data => {
      if (data?.length||0 > 0){
        return false
      } else {
        return true
      }
    })
  );

  constructor(
    private readonly _route : Router,
    private readonly _dbAccess : AngularfireService,
    readonly _auth : Auth
    ) {
  }

  navigateToDiscussion(id:string,name:string){
    this._route.navigate(["discussion"],{queryParams:{discussionId:id,discussionName:name}})
  }

  filterActivities(){
    this.searchQ.next(this.searchValue);
  }

  subscribe(isSubscribed:boolean,eventId:string){
    if(!this._auth.currentUser?.uid)
      return;

    if(!isSubscribed){
      this._dbAccess.addUserToRequest(eventId)
    }else{
      this._dbAccess.removeUserFromRequest(eventId)
    }
  }

  isLogged(){
    return this._auth.currentUser?.uid;
  }

  createPendingRequest(){
    this._dbAccess.createPendingRequest(this.searchValue)
  }

  createActivity(){
    console.log("creating ",this.searchValue);
    this._dbAccess.createActivity(this.searchValue);
    this._dbAccess.deletePendingRequest(this.searchValue);
    this.searchValue = "";
  }

  handleEscKey(){
    this.searchValue = "";
  }

  async handleEnterKey(){
    const choosenActivity = await firstValueFrom(this.filteredActivitiesList);
    const choosenRequest = await firstValueFrom(this.filteredPendingRequestsList);
    if(choosenActivity.length === 1){
      this.navigateToDiscussion(choosenActivity[0]['id'],choosenActivity[0]['name']);
    }else if(choosenRequest.length === 1){
      console.log("Should subscribe to ");
      
      // TODO subscribe to activity
    }else if(choosenActivity.length === 0 && choosenRequest.length === 0){
      console.log("creating pending request");
      this.createPendingRequest();
    }
  }
}
