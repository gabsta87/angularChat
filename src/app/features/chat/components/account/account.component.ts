import { Component, OnInit } from '@angular/core';
import { Auth, GoogleAuthProvider, signInAnonymously, signOut } from '@angular/fire/auth';
import { signInWithPopup } from '@firebase/auth';
import { firstValueFrom } from 'rxjs';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit{

  autoLocation!:boolean;
  attendedEvents!:any;
  createdEvents!:any;

  constructor(private readonly _auth: Auth,private readonly _dbAccess:AngularfireService) {}
  
  ngOnInit(): void {
    this.loadData();
  }

  async loadData(){
    let userId = this._auth?.currentUser?.uid;
    if(userId){
      this.attendedEvents = await firstValueFrom(this._dbAccess.getEventsAttendedBy(userId));
      this.createdEvents = await firstValueFrom(this._dbAccess.getEventsCreatedBy(userId));
    }
  }

  async logout(){
    await signOut(this._auth);
  }

  isLogged(){
    return this._auth.currentUser;
  }

  async loginWithGoogle(){
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(this._auth,provider);
    this._dbAccess.createUser(credential.user);
    this.loadData();
  }

  async loginAnonymously(){
    const credential = await signInAnonymously(this._auth);
    this._dbAccess.createUser(credential.user);
    this.loadData();
  }

}
