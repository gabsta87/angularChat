import { Component, OnInit } from '@angular/core';
import { Auth, GoogleAuthProvider, signInAnonymously, signOut } from '@angular/fire/auth';
import { signInWithPopup } from '@firebase/auth';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  autoLocation!:boolean;

  constructor(private readonly _auth: Auth,private readonly _dbAccess:AngularfireService) { }

  ngOnInit(): void {
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
    console.log("credential = ",credential);
  }

  async loginAnonymously(){
    const credential = await signInAnonymously(this._auth);
    this._dbAccess.createUser(credential.user);
    console.log("credential = ",credential);
  }

}
