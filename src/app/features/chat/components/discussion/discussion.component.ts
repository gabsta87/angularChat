import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DbaccessService } from 'src/app/shared/service/dbaccess.service';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss']
})
export class DiscussionComponent {

  @Input() discussionId!:string;
  @Input() discussionName!:string;
  messagesList!:any;
  usersList!:any;

  ionViewWillEnter(){
    this.discussionId = this._route.snapshot.queryParams["discussion"];
    this.discussionName = this._route.snapshot.queryParams["discussionName"];
    this.loadData();
  }

  constructor(private readonly _route : ActivatedRoute, private readonly _dataLoader: DbaccessService){
  }

  async loadData(event?:any){
    this.messagesList = await this._dataLoader.getMessages(this.discussionId);
    console.log("messages loaded = ",this.messagesList);
    
    this.usersList = await this._dataLoader.getUsers(this.discussionId);
    console.log("users loaded = ",this.usersList);

  }

}
