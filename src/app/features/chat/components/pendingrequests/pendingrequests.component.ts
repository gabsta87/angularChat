import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pendingrequests',
  templateUrl: './pendingrequests.component.html',
  styleUrls: ['./pendingrequests.component.scss']
})
export class PendingrequestsComponent implements OnInit {

  constructor() {
    console.log("TODO : load pending requests");
  }

  ngOnInit(): void {
  }

}