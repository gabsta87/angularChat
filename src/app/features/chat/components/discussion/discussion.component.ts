import { Component, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';
import { DbaccessService } from 'src/app/shared/service/dbaccess.service';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss']
})
export class DiscussionComponent {

  currentMessage!:any;

  discussionId!:string;
  discussionName!:string;
  // messagesList!:{key:string, date: string, message: string, userId: string};
  messagesList!:any;
  usersMap = new Map();
  @ViewChild(IonContent) ionContent!:IonContent; 

  async ionViewWillEnter(){
    this.discussionId = this._route.snapshot.queryParams["discussionId"];
    this.discussionName = this._route.snapshot.queryParams["discussionName"];
    await this.loadData();
    setTimeout(()=>this.ionContent.scrollToBottom(),125);
  }

  constructor(private readonly _route : ActivatedRoute, 
    private readonly _dataLoader: DbaccessService,
    private readonly _fireStore:AngularfireService
    ){}

  async loadData(event?:any){
    this.messagesList = [];
    Object.entries(await this._dataLoader.getMessages(this.discussionId))
    .slice(1,)
    .forEach(([key,value]:[key:string,value:any])=>{
      this.messagesList.push({key,...value})
    });

    this.messagesList.forEach((elem:{userId:string}) => {
      this.getUserName(elem.userId);
    });
  }

  async getUserName(userId:string){
    let temp = this.usersMap.get(userId);
    if(temp === undefined){
      temp = await this._dataLoader.getUser(userId);
      this.usersMap.set(temp.key,temp.firstname);
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

  updateValue($event:any){
    this.currentMessage = $event.target.value;
  }

  sendMessage(){
    this._fireStore.writeMessage(this.currentMessage);
    this.currentMessage = "";
  }

}
