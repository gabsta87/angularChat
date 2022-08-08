import { Component, OnInit, ViewChild } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { DocumentData } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { map, Observable, tap } from 'rxjs';
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
    this.messagesList = await this._fireStore.getMessages(this.discussionId);

    console.log("ml : ",this.messagesList);
    
    console.log("WARNING : not getting names");
    // this.messagesList.pipe(map((e:any) => this.getUserName(e.userId)));
    this.messagesList.pipe(tap(console.log),map((e:any) => {console.log("salut"); return this.getUserName(e.userId);}));
    setTimeout(()=>this.ionContent.scrollToBottom(),125);
  }

  constructor(
    private readonly _route : ActivatedRoute, 
    // private readonly _dataLoader: DbaccessService,
    private readonly _fireStore:AngularfireService,
    private readonly _auth:Auth,
  ){}

  async getUserName(userId:string){
    let temp = this.usersMap.get(userId);
    console.log("getting ",userId," from ",this.usersMap);

    if(temp === undefined){
      temp = await this._fireStore.getUser(userId);
      console.log("temp user = ",temp);

      if(temp)
        this.usersMap.set(temp.id,temp.name);
    }
    console.log("temp user = ",temp);
    return temp;
  }

  doRefresh(event:any) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  sendMessage(){
    this._fireStore.writeMessage(this.discussionId,this.currentMessage,"activities");
    this.currentMessage = "";
  }

  checkKey(event:any){
    if(event.charCode === 13){
      this.sendMessage();
    }
  }
}
