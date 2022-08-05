import { Injectable, Query } from '@angular/core';
import { collection, collectionData, doc, QueryConstraint, DocumentData, Firestore, getDoc, setDoc, where, limit, getDocs } from '@angular/fire/firestore';
import { query } from '@firebase/firestore';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AngularfireService {

  private _messages!:Observable<DocumentData[]>;

  constructor(private readonly _dbaccess:Firestore) { }

  private async getElements(name:string,constraint?:QueryConstraint){
    const myCollection = collection(this._dbaccess,name);

    let data;
    if(constraint){
      data = await query(myCollection,constraint)
    }else{
      data = await query(myCollection);
    }

    const querySnapshot = await getDocs(data);

    let result:any[] = [];
    querySnapshot.forEach((doc) => {
      result.push({id:doc.id,...doc.data()})
    });
    return result;
  }

  async getPendingRequests(){
    let requestsList = await this.getElements("requests");
    console.log("requests : ",requestsList);
    return requestsList;
  }

  async getActivities(){
    let activitiesList = await this.getElements("activities");
    console.log("activities : ",activitiesList);
    return activitiesList;
  }

  async getEvents(){
    let eventsList = await this.getElements("events");
    console.log("events : ",eventsList);
    return eventsList;
  }

  async getUsers(){
    let usersList = await this.getElements("users");
    console.log("users : ",usersList);
    return usersList;
  }

  async getUser(userId:string){
    let temp = await this.getUsers();
    return temp.find((e:{id:string})=>{e.id === userId});
  }

  createActivity(name:string){
    console.log("trying to add ",name," into db");
  }

  async getMessages(discussionId:string,count?:number){
    // TODO fix document/collection access
    console.log("TODO fix document/collection access");

    const discussion:QueryConstraint = where("refId","==",discussionId);
    let messagesDoc = await this.getElements("messages",discussion)
    console.log("messages : ",messagesDoc);
    return messagesDoc;
  }

  writeMessage(discussionId:string,message:string,user:{id:string}){
      // const docRef = doc(this._dbaccess,"messages");
      // setDoc(docRef,{content:message,date:Date.now,discussionId:discussionId,user:user.id});
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
