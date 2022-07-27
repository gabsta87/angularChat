import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() parentPage!:any;
  @Input() discussionName!:any;

  constructor(private readonly _route : Router, private readonly _activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

  ionViewWillEnter(){
    this.discussionName = this._activatedRoute.snapshot.queryParams["discussionName"];
    console.log("disc name = ",this.discussionName);
  }

  navigateBack(){
    this._route.navigate(["activities"]);
  }
}
