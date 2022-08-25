import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, linkWithCredential, signInAnonymously, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { signInWithPopup } from '@firebase/auth';
import { BehaviorSubject, firstValueFrom, of } from 'rxjs';
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

  // autoLocation!:boolean;
  attendedEvents!:any;
  createdEvents!:any;

  accountData!:any;

  isLoggedConst = new BehaviorSubject(this._auth.currentUser)

  constructor(
    private readonly _auth: Auth,
    private readonly _dbAccess:AngularfireService,
    private readonly _route: ActivatedRoute
    ) {
  }

  ionViewWillEnter(): void {
    this.accountData = this._route.snapshot.data['accountData'];

    this.userName = this.accountData.userPseudo;
    this.emailAddress = this.accountData.userEmail;
    this.attendedEvents = this.accountData.attendingEvents;
    this.createdEvents = this.accountData.createdEvents;
  }

  async loadData(){
    let userId = this._auth?.currentUser?.uid;
    if(userId){
      let loadedUser = await this._dbAccess.getUser(userId);

      if(!loadedUser || loadedUser['name'] === undefined){
        this.userName = "Anonymous"
      }else{
        this.userName = loadedUser['name'];
      }

      if(this._auth.currentUser?.email)
        this.emailAddress = this._auth.currentUser.email

      this.attendedEvents = await firstValueFrom(this._dbAccess.getEventsAttendedBy(userId));
      this.createdEvents = await firstValueFrom(this._dbAccess.getEventsCreatedBy(userId));
    }
    this.isLoggedConst.next(this._auth.currentUser);
  }

  updateName(){
    this._dbAccess.setUser(this.userName);
    alert("name updated");
  }

  async logout(){
    await signOut(this._auth);
    this.userName = "";
    this.emailAddress = "";
    this.password = "";
    this.isLoggedConst.next(this._auth.currentUser);
  }

  async loginWithGoogle(){
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(this._auth,provider);
    this._dbAccess.createUser(credential.user);
    this.loadData();
    return credential;
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
    if(!this.emailAddress || !this.password){
      console.log("Missing email and/or password");
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
