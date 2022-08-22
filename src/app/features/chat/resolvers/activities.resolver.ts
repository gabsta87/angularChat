import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';

export interface Activity{
  id:string,
  name:string,
}

@Injectable({
  providedIn: 'root'
})
export class ActivitiesResolver implements Resolve<Activity[]> {
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot, dataAccess: AngularfireService): Promise<Activity[]> {
    let temp = await firstValueFrom(dataAccess.getActivities());
    let result:Activity[] = [] as Activity[]|Promise<Activity[]>|Observable<Activity>;
    temp.forEach((e:any) => result.push({id:e['id'],name:e['name']}));
    return result;
  }
}
