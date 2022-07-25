import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss']
})
export class DiscussionComponent {

  @Input() discussionId!:number;

  ionViewWillEnter(){
    console.log("TODO : load the discussion ",this.discussionId);
  }

}
