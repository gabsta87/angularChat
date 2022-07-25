import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chatslist',
  templateUrl: './chatslist.component.html',
  styleUrls: ['./chatslist.component.scss']
})
export class ChatslistComponent implements OnInit {

  @Input() elementsToShow!:any;

  constructor() { }

  ngOnInit(): void {
  }

}
