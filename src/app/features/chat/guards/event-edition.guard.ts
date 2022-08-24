import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { EventDataService } from '../services/event-data.service';

@Injectable({
  providedIn: 'root'
})
export class EventEditionGuard implements CanActivate {
  constructor(private readonly _auth:Auth,private readonly _dataService:EventDataService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log("event data : ",this._dataService.getEventData());

    if(!this._dataService.getEventData().eventCreatorId)
      return true;

    return this._auth.currentUser?.uid === this._dataService.getEventData().eventCreatorId;
  }
}
