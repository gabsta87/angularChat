import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
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
      return requestsList.filter((elem:any) => elem['name'].toLowerCase().includes(searchQuery.toLowerCase()))
    })
  )

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
    private readonly _dbAccess : AngularfireService) {
  }

  navigateToDiscussion(item:any){
    this._route.navigate(["discussion"],{queryParams:{discussionId:item.id,discussionName:item.name}})
  }

  filterActivities(){
    this.searchQ.next(this.searchValue);
  }

  action(event:any){
    console.log("subscribe to pending request = ",event.detail.checked);
  }

  createActivity(){
    console.log("creating ",this.searchValue);
    this._dbAccess.createActivity(this.searchValue);
    // TODO
    // this._dbAccess.removePendingRequest(this.searchValue);
    this.searchValue = "";
  }
}
