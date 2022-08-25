import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isAttending'
})
export class IsAttendingPipe implements PipeTransform {

  transform(attendantsId: string[], currentUser:{uid:string}|null): boolean {
    if(!currentUser)
      return false;
    return attendantsId.includes(currentUser.uid);
  }

}
