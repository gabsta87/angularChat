import { Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { collection, QueryConstraint, DocumentData, Firestore, where, getDocs, addDoc, collectionData, orderBy } from '@angular/fire/firestore';
import { query } from '@firebase/firestore';
import { isEmpty, map, Observable } from 'rxjs';
import { DataAccess } from './dataAccess';

@Injectable({
  providedIn: 'root'
})
export class AngularfireService implements DataAccess{

  constructor(private readonly _dbaccess:Firestore, private readonly _auth:Auth) { }

  private async getElements(name:string,...constraint:QueryConstraint[]){
    const myCollection = collection(this._dbaccess,name);

    let data = await query(myCollection,...constraint)

    const querySnapshot = await getDocs(data);

    const observableStream = collectionData(data, {idField: 'id'})
    return observableStream;

    // observableStream.pipe(
    //   map(datas => {
    //     // ici je peux manipuler les datas ...

    //     // je n'oublie pas de retourner les data manipulées
    //     return datas;
    //   })
    // )
  }

  async getPendingRequests(){
    let requestsList = await this.getElements("requests");
    return requestsList;
  }

  async getActivities(){
    let activitiesList = await this.getElements("activities");
    return activitiesList;
  }

  async getActivity(activityId:string){
    let temp = await this.getActivities();
    return temp.pipe(map(datas => datas.find(e => e['id'] === activityId)));
  }

  async getEvents(){
    let eventsList = await this.getElements("events");
    return eventsList;
  }

  async getUsers(){
    let usersList = await this.getElements("users");
    return usersList;
  }

  async getUser(userId:string){
    let temp = await this.getUsers();
    return temp.pipe(map(datas => datas.find(e => e['id'] === userId)));
  }

  async createActivity(name:string){
    return await addDoc(collection(this._dbaccess,"activities"),{name:name});
  }

  async createUser(newUser:User){
    let userId = newUser.uid;
    let userStored = await this.getUser(userId);

    if(userStored.pipe(isEmpty())){
      return await addDoc(collection(this._dbaccess,"users"),{name:newUser.displayName});
    }
    return undefined;
  }

  async getMessages(discussionId:string,count?:number){
    const discussion:QueryConstraint = where("discussionId","==",discussionId);
    const orderByDate:QueryConstraint = orderBy("date","asc");
    let messagesDoc = await this.getElements("messages",discussion,orderByDate);
    // messagesDoc.sort((a:{date:string},b:{date:string}) => {return a.date > b.date ? 1 : ((b.date > a.date) ? -1 : 0)});
    return messagesDoc;
  }

  writeMessage(discussionId:string,message:string,type:string){
    addDoc(collection(this._dbaccess,"messages"),{content:message,date:Date.now(),discussionId:discussionId,type:type,userId:this._auth.currentUser?.uid});
  }

  createPendingRequest(name: string, userId: string) {
    throw new Error('Method not implemented.');
  }
  deletePendingRequest(requestId: string) {
    throw new Error('Method not implemented.');
  }
  createEvent(name: string, creatorId: string, date: string, location: string) {
    throw new Error('Method not implemented.');
  }
  deleteEvent(eventId: string) {
    throw new Error('Method not implemented.');
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
