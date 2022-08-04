import { Injectable } from '@angular/core';
import { collection, collectionData, doc, DocumentData, Firestore, setDoc } from '@angular/fire/firestore';
import { query } from '@firebase/firestore';
import { map, Observable, tap } from 'rxjs';
import { uuid } from 'uuidv4';

@Injectable({
  providedIn: 'root'
})
export class AngularfireService {

  private _myData!:Observable<DocumentData[]>;
  private _dbName:string = "meectivity";

  constructor(private readonly _dbaccess:Firestore) { }

  async getActivities(){
    // Need 1 more argument here
    const myCollection = collection(this._dbaccess,this._dbName,"activities","2");
    const q = query(myCollection);
    this._myData = await collectionData(q,{idField:'id'}).pipe(
      tap(e=>console.log(e)),
      map((value:any[]) => {
          return value.map((todo)=> {
              const {userId,...data} = todo
              return data;
          })
        }));
    return this._myData;
  }

  async getMessages(discussionId:string){
    const myCollection = collection(this._dbaccess,this._dbName,"discussions",discussionId);
    const q = query(myCollection);
    this._myData = await collectionData(q,{idField:'id'});
    return this._myData;
  }

  writeMessage(message:string){
    const id = uuid();
    console.log("id from uuid : ",id);
    
    const docRef = doc(this._dbaccess,this._dbName+'/'+id);
    setDoc(docRef,{messageContent:message});
  }

  async getMessagesFromDiscussion(discussion:string){
    const myCollection = collection(this._dbaccess,this._dbName,'/discussions/',discussion);
    const q = query(myCollection);
    this._myData = await collectionData(q,{idField:'id'});
    return this._myData;
  }

  writeMessageToDiscussion(discussion:string,message:string){
    const id = uuid();
    console.log("id from uuid : ",id);
    
    const docRef = doc(this._dbaccess,this._dbName+'/discussions/'+discussion+'/'+id);
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
