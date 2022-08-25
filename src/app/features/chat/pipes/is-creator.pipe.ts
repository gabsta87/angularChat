import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isCreator'
})
export class IsCreatorPipe implements PipeTransform {

  transform(currentUser: {uid:string}|null, creatorId: string): boolean {
    if(!currentUser)
      return false;
    return currentUser.uid === creatorId;
  }

}
