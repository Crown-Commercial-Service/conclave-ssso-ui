import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'permission'
})
export class PermissionPipe implements PipeTransform {

transform(array: any[]): any[] {
  return array.sort((a, b) => a.orderId - b.orderId);
  }
}
