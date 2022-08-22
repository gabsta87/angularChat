import { Component, ViewChild } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { DocumentData } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Observable, switchMap, tap } from 'rxjs';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss']
})
export class DiscussionComponent{
  currentMessage!:any;
  discussionId!:string;
  discussionName!:string;
  messagesList!:Observable<DocumentData[]>;
  usersMap = new Map();
  @ViewChild(IonContent) ionContent!:IonContent;

  async ionViewWillEnter(){
    this.discussionId = this._route.snapshot.queryParams["discussionId"];
    this.discussionName = this._route.snapshot.queryParams["discussionName"];
    this.messagesList = this._fireStore.getMessages(this.discussionId);
    this.currentMessage = "";

    this.messagesList = this.messagesList.pipe(tap(console.log),switchMap(async (e:any) => {
      e.forEach(async (elem:any)=>await this.getUserName(elem.userId))
      return e;
    }));
    setTimeout(()=>this.ionContent.scrollToBottom(),125);
  }

  constructor(
    private readonly _route : ActivatedRoute,
    private readonly _fireStore:AngularfireService,
    private readonly _auth: Auth
  ){}

  async getUserName(userId:string){
    let temp = this.usersMap.get(userId);
    // console.log("getting ",userId," from ",this.usersMap);

    if(temp === undefined){
      temp = await this._fireStore.getUser(userId);

      if(temp)
        this.usersMap.set(temp.id,temp.name);
    }
    return temp;
  }

  isLogged(){
    return this._auth.currentUser?.uid;
  }

  sendMessage(){
    this._fireStore.writeMessage(this.discussionId,this.currentMessage);
    this.currentMessage = "";
  }

  handleEnterKey(){
    this.sendMessage();
  }

  handleEscKey(){
    this.currentMessage = "";
  }

  // // Method for infinite scroll
  // doRefresh(event:any) {
  //   console.log('Begin async operation');

  //   setTimeout(() => {
  //     console.log('Async operation has ended');
  //     event.target.complete();
  //   }, 2000);
  // }

}
