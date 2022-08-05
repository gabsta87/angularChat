import { Component, ViewChild } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss']
})
export class DiscussionComponent {

  currentMessage!:any;

  discussionId!:string;
  discussionName!:string;
  // messagesList!:{id:string, date: string, content: string, userId: string};
  messagesList!:any;
  usersMap = new Map();
  @ViewChild(IonContent) ionContent!:IonContent; 

  async ionViewWillEnter(){
    this.discussionId = this._route.snapshot.queryParams["discussionId"];
    this.discussionName = this._route.snapshot.queryParams["discussionName"];
    await this.loadData();
    setTimeout(()=>this.ionContent.scrollToBottom(),125);
  }

  constructor(
    private readonly _route : ActivatedRoute, 
    // private readonly _dataLoader: DbaccessService,
    private readonly _fireStore:AngularfireService,
    private readonly _auth:Auth,
    ){}

  async loadData(event?:any){
    this.messagesList = await this._fireStore.getMessages(this.discussionId);

    this.messagesList.forEach((elem:{userId:string}) => {
      this.getUserName(elem.userId);
    });
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

}
