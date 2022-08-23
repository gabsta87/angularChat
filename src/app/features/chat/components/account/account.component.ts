import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, linkWithCredential, signInAnonymously, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
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
  emailAddress!:string;
  password!:string;

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
      let loadedUser = await this._dbAccess.getUser(userId);
      console.log("user loaded : ",loadedUser);

      if(!loadedUser || loadedUser['name'] === undefined){
        this.userName = "Anonymous"
      }else{
        this.userName = loadedUser['name'];
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
    this.userName = "";
    this.emailAddress = "";
    this.password = "";
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
    return credential;
  }

  async loginLocally(){
    const auth = getAuth();
    signInWithEmailAndPassword(auth, this.emailAddress, this.password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log("user : ",user);
        console.log("missing username : ",this.userName);
        this._dbAccess.createUser(user);
        this.loadData();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("error : ",error);
        alert(error.message)
      });
  }

  async createAccount(){
    if(!this.emailAddress || !this.password || !this.userName){
      console.log("Missing user name and/or email and/or password");
      return;
    }
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, this.emailAddress, this.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("user : ",user);
        console.log("missing username : ",this.userName);
        this._dbAccess.createUser(user);
        this.loadData();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("error : ",error);
        alert(error.message)
      });
  }
}
