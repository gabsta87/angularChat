import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventCreateGuard implements CanActivate {

  constructor(private readonly _auth:Auth,private readonly _router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this._auth.currentUser?.uid === undefined)
      this._router.navigate(["pendingevents"])
    return this._auth.currentUser?.uid !== undefined;
  }
}
