import { Component, Input, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';
import { DataAccess } from 'src/app/shared/service/dataAccess';

@Component({
  selector: 'app-pendingrequests',
  templateUrl: './pendingrequests.component.html',
  styleUrls: ['./pendingrequests.component.scss']
})
export class PendingrequestsComponent implements OnInit{

  @Input() searchValue:any;
  pendingRequestsList!:any;
  pendingRequestsListFiltered!:Observable<DocumentData[]>;
  requestsMap = new Map();

  constructor(private readonly _dataAccess: AngularfireService) {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(){
    this.pendingRequestsList = await this._dataAccess.getPendingRequests();
    this.pendingRequestsListFiltered = this.pendingRequestsList;
  }

  filter(){
    this.pendingRequestsListFiltered = 
    this.pendingRequestsList.pipe(map((e:any)=>  e
    .filter((e:any) => e['name'].toLowerCase().includes(this.searchValue.toLowerCase()))
    )
    );
  }

  action(event:any){
    console.log("event = ",event);
  }
}
