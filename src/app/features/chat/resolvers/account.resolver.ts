import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { firstValueFrom, Observable, of } from 'rxjs';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';

interface AccountData{
  userId:string|undefined,
  userPseudo:string,
  userEmail:string,
  createdEvents:any[],
  attendingEvents:any[],
}

@Injectable({
  providedIn: 'root'
})
export class AccountResolver implements Resolve<AccountData> {

  constructor(private readonly _auth:Auth,private readonly _dbAccess: AngularfireService){}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<AccountData> {
    let result = {} as AccountData;
    result.userId = this._auth?.currentUser?.uid;
    
    if(result.userId){
      let loadedUser = await this._dbAccess.getUser(result.userId);
      if(!loadedUser || loadedUser['name'] === undefined){
        result.userPseudo = "Anonymous"
      }else{
        result.userPseudo = loadedUser['name'];
      }

      if(this._auth.currentUser?.email)
        result.userEmail = this._auth.currentUser.email

      result.attendingEvents = await firstValueFrom(this._dbAccess.getEventsAttendedBy(result.userId));
      result.createdEvents = await firstValueFrom(this._dbAccess.getEventsCreatedBy(result.userId));
    }
    return result;
  }
}
