import { Component, OnInit } from '@angular/core';
import { Auth, GoogleAuthProvider, signInAnonymously, signOut, user } from '@angular/fire/auth';
import { signInWithPopup } from '@firebase/auth';
import { firstValueFrom } from 'rxjs';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent{

  userName!:string;

  autoLocation!:boolean;
  attendedEvents!:any;
  createdEvents!:any;

  constructor(private readonly _auth: Auth,private readonly _dbAccess:AngularfireService) {}
  
  onViewWillEnter(): void {
    this.loadData();
  }

  async loadData(){
    let userId = this._auth?.currentUser?.uid;
    if(userId){
      let temp = await this._dbAccess.getUser(userId);
      if(!temp || temp['name'] === undefined){
        this.userName = "Anonymous"
      }else{
        this.userName = temp['name'];
      }

      this.attendedEvents = await firstValueFrom(this._dbAccess.getEventsAttendedBy(userId));
      this.createdEvents = await firstValueFrom(this._dbAccess.getEventsCreatedBy(userId));
    }
  }

  updateName(){
    console.log("updating name");
    this._dbAccess.setUser(this.userName);
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
    this._dbAccess.createUser(credential.user,"Anonymous");
    this.loadData();
  }

  loginLocally(){

  }

  createAccount(){
    
  }
}
