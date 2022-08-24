import { Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { collection, QueryConstraint, Firestore, where, addDoc, collectionData, orderBy, setDoc, doc, deleteDoc, updateDoc, arrayUnion, arrayRemove, getDoc } from '@angular/fire/firestore';
import { query, GeoPoint } from '@firebase/firestore';
import { firstValueFrom, map, min } from 'rxjs';
import { DataAccess } from './dataAccess';

@Injectable({
  providedIn:'root'
})
export class AngularfireService implements DataAccess{
  constructor(
    private readonly _dbaccess:Firestore,
    private readonly _auth:Auth) { }

  private getElements(name:string,...constraint:QueryConstraint[]){
    const myCollection = collection(this._dbaccess,name);

    let data = query(myCollection,...constraint)

    const observableStream = collectionData(data, {idField: 'id'})
    return observableStream;
  }

  getPendingRequests(){
    let requestsList = this.getElements("requests");
    return requestsList;
  }

  getActivities(){
    let activitiesList = this.getElements("activities");
    return activitiesList;
  }

  getActivity(activityId:string){
    // TODO accéder au document et récupérer l'observable
    // const docRef = doc(this._dbaccess, "activities", activityId);
    // const dateConstr:QueryConstraint = where("id","==",activityId);
    // return this.getElements("activities",dateConstr);
    let temp = this.getActivities();
    return temp.pipe(map(datas => datas.find(e => e['id'] === activityId)));
  }

  getEvents(){
    let eventsList = this.getElements("events");
    return eventsList;
  }

  getUpToDateEvents(){
    let eventsList = this.getElements("events",where("timeStamp",">",Date.now()));
    return eventsList;
  }

  getEventsCreatedBy(userId:string){
    let eventsList = this.getElements("events",where("creatorId","==",userId));
    return eventsList;
  }

  getEventsAttendedBy(userId:string){
    let eventsList = this.getElements("events",where("attendantsId","array-contains",userId));
    return eventsList;
  }

  getEvent(eventId:string){
    // TODO accéder au document et récupérer l'observable
    // console.log("searching event ",eventId);
    // const dateConstr:QueryConstraint = where("id","==",eventId);
    // let temp = this.getElements("events",dateConstr);
    // console.log("event found : ",temp);
    // return temp;
    let temp = this.getEvents();
    return temp.pipe(map(datas => datas.find(e => e['id'] === eventId)));
  }

  getUsers(){
    let usersList = this.getElements("users");
    return firstValueFrom(usersList);
  }

  async getUser(userId:string){
    let temp = await this.getUsers();
    return temp.find(e => e['id'] === userId);
  }

  setUser(newName:string) {
    const docRef = doc(this._dbaccess,'users/'+this._auth.currentUser?.uid);
    return setDoc(docRef,{name:newName});
  }

  createActivity(name:string){
    return addDoc(collection(this._dbaccess,"activities"),{name:name});
  }

  async createUser(newUser:User,userName?:string){
    let userId = newUser.uid;
    let userStored = await this.getUser(userId);

    if(userStored){
      return
    }

    const docRef = doc(this._dbaccess,'users/'+userId);
    return setDoc(docRef,{name: userName ? userName : newUser.displayName});
  }

  getMessages(discussionId:string,count?:number){
    const discussion:QueryConstraint = where("discussionId","==",discussionId);
    const orderByDate:QueryConstraint = orderBy("date","asc");
    let messagesDoc = this.getElements("messages",discussion,orderByDate);
    return messagesDoc;
  }

  writeMessage(discussionId:string,message:string){
    if(!this._auth.currentUser?.uid)
      return;
    return addDoc(collection(this._dbaccess,"messages"),{content:message,date:Date.now(),discussionId:discussionId,userId:this._auth.currentUser?.uid});
  }

  getPendingRequest(requestId: string) {
    let temp = this.getPendingRequests();
    return temp.pipe(map(datas => datas.find(e => e['id'] === requestId)));
  }

  createPendingRequest(name: string) {
    if(!this._auth.currentUser?.uid)
      return
    return addDoc(collection(this._dbaccess,"requests"),{name:name,attendantsId:[this._auth.currentUser.uid]});
  }

  deletePendingRequest(requestId: string) {
    const docRef = doc(this._dbaccess,`requests/${requestId}`);
    return deleteDoc(docRef);
  }

  async createEvent(event : 
    {name:string, 
      activityId:string, 
      description:string, 
      date: string, 
      attendantsId?:any[],
      timeStamp:number, 
      position:{latitude:number,longitude:number},
      creatorId?:string}){
    console.log("angular fire service : ",event);
    
    event.creatorId = this._auth.currentUser?.uid;
    console.log("event creator : ",event.creatorId);
    
    event.attendantsId = [];
    if(!event.creatorId)
      return;
    event.position = new GeoPoint(event.position.latitude,event.position.longitude);
    return addDoc(collection(this._dbaccess,"events"),event);
  }

  updateEvent(eventId:string,eventUpdates:{name:string, activityId:string, description:string,date:string, timeStamp:number}){
    console.log("updating ",`events/${eventId}`, " updates: ",eventUpdates);

    const docRef = doc(this._dbaccess,`events/${eventId}`);
    return setDoc(docRef,eventUpdates,{ merge: true });
  }

  async deleteEvent(eventId: string) {
    let currentEvent = await firstValueFrom(this.getEvent(eventId));

    if(!this._auth.currentUser?.uid || !currentEvent || this._auth.currentUser.uid != currentEvent['creatorId'])
      return;

    const docRef = doc(this._dbaccess,`events/${eventId}`);
    return deleteDoc(docRef);
  }

  private addUser(tableName:string,itemId:string){
    const docRef = doc(this._dbaccess, `${tableName}/${itemId}`);
    return updateDoc(docRef, {attendantsId: arrayUnion(this._auth.currentUser?.uid)});
  }

  addUserToEvent(eventId:string){
    return this.addUser("events",eventId);
  }

  async addUserToRequest(requestId:string){
    this.addUser("requests",requestId);
    const docRef = doc(this._dbaccess, `meta/infos`);
    let minSize = await getDoc(docRef).then((e:any) => e.data()['requestSize']);

    const docRequestRef = doc(this._dbaccess, `requests/${requestId}`);
    let request = await getDoc(docRequestRef).then((e:any) => e.data());
    let currentNumber = request['attendantsId'].length;
    
    if(currentNumber > minSize){
      console.log("adding activity");
      this.createActivity(request.name);
      console.log("deleting request");
      this.deletePendingRequest(requestId);
    }
  }

  private async removeUser(tableName:string,itemId:string){
    const docRef = doc(this._dbaccess, `${tableName}/${itemId}`);
    return await updateDoc(docRef, {attendantsId: arrayRemove(this._auth.currentUser?.uid)});
  }

  removeUserFromRequest(requestId:string){
    return this.removeUser("requests",requestId);
    // TODO remove request if last user unsubcribes
  }

  removeUserFromEvent(eventId:string){
    return this.removeUser("events",eventId);
    // TODO decide in which conditions to remove events
    // For example, if there are no more attendants before the event,
    // If the creator deletes the event
  }
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
