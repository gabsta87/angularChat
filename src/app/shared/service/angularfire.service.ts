import { Injectable } from '@angular/core';
import { collection, collectionData, doc, QueryConstraint, DocumentData, Firestore, getDoc, setDoc, where, limit } from '@angular/fire/firestore';
import { query } from '@firebase/firestore';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AngularfireService {

  private _messages!:Observable<DocumentData[]>;

  constructor(private readonly _dbaccess:Firestore) { }

  private async getElements(name:string){
    const ref = doc(this._dbaccess,name);
    const myDoc:any = await getDoc(ref);
    const collectionsList = myDoc._document.data.value;

    console.log("list of collections : ",collectionsList);

    return collectionsList;
  }

  async getActivities(){
    console.log("getting activities");
    // const myCollection = collection(this._dbaccess,this._dbName);
    
    let activitiesList = await this.getElements("activities");
    
    console.log("activities list = ",activitiesList);

    return activitiesList;
  }
// const final = doc(this._dbaccess,this._dbName,"activities").coll

// const myDocument = document(this._dbaccess,this._dbName+"/activities/","Foot");
// const q = query(messageRef);
// this._myData = await collectionData(q,{idField:'id'}).pipe(
//   tap(e=>console.log("e = ",e)),
//   map((value:any[]) => {
//       return value.map((todo)=> {
//           const {userId,...data} = todo
//           return data;
//       })
//   }));

  createActivity(name:string){
    console.log("trying to add ",name," into db");
  }

  async getMessages(discussionId:string,count?:number){
    const myCollection = collection(this._dbaccess,"messages");
    const discussion:QueryConstraint = where("refId","==",discussionId);

    let quer;
    if(count){
      quer = query(myCollection,discussion,limit(count));
    }else{
      quer = query(myCollection,discussion);
    }

    this._messages = await collectionData(quer,{idField:'id'});
    return this._messages;
  }

  writeMessage(message:string){
    
  }

  async getMessagesFromDiscussion(discussion:string){
    const myCollection = collection(this._dbaccess,'/messages/',discussion);
    const q = query(myCollection);
    this._messages = await collectionData(q,{idField:'id'});
    return this._messages;
  }

  writeMessageToDiscussion(discussion:string,message:string){
    const id = Date.now();
    const docRef = doc(this._dbaccess,'/messages/'+discussion+'/'+id);
    setDoc(docRef,{messageContent:message});
  }

  // addOrder(newValue:number){
  //   const id = Date.now();
  //   const docRef = doc(this._dbaccess,this._dbName+'/'+id);
  //   setDoc(docRef,{orderValue:newValue});
  // }

  // async updateOrder(id:string){
  //   const docRef = doc(this._dbaccess, `${this._dbName}/${id}`);
  //   updateDoc(docRef,{done:true});
  // }

  // async deleteOrder(id:string){
  //   const docRef = doc(this._dbaccess,`${this._dbName}/${id}`);
  //   deleteDoc(docRef);
  // }
}
