import { Component, OnInit, ViewChild } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { DocumentData } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { map, Observable } from 'rxjs';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss']
})
export class DiscussionComponent implements OnInit{

  currentMessage!:any;

  discussionId!:string;
  discussionName!:string;
  messagesList!:Observable<DocumentData[]>;
  usersMap = new Map();
  @ViewChild(IonContent) ionContent!:IonContent; 

  async ionViewWillEnter(){
    setTimeout(()=>this.ionContent.scrollToBottom(),125);
  }

  async ngOnInit(){
    await this.loadData();
  }

  constructor(
    private readonly _route : ActivatedRoute, 
    // private readonly _dataLoader: DbaccessService,
    private readonly _fireStore:AngularfireService,
    private readonly _auth:Auth,
  ){}

  async loadData(){
    this.discussionId = this._route.snapshot.queryParams["discussionId"];
    this.discussionName = this._route.snapshot.queryParams["discussionName"];
    this.messagesList = await this._fireStore.getMessages(this.discussionId);
    this.messagesList.pipe(map((e:any) => this.getUserName(e.userId)));
  }

  async getUserName(userId:string){
    let temp = this.usersMap.get(userId);
    if(temp === undefined){
      temp = await this._fireStore.getUser(userId);

      if(temp)
        this.usersMap.set(temp.id,temp.name);
    }
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
    this._fireStore.writeMessage(this.discussionId,this.currentMessage,"activities",this._auth.currentUser);
    this.currentMessage = "";
  }

  checkKey(event:any){
    if(event.charCode === 13){
      this.sendMessage();
    }
  }
}
