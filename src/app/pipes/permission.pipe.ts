import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'permission'
})
export class PermissionPipe implements PipeTransform {

transform(array: any[]): any[] {
    // Create an empty map to store unique items based on their 'orderId'
    const uniqueMap = new Map<number, any>();

    // Loop through the array, and if an item with the same 'orderId' already exists in the map, skip it (removing duplicates)
    // Otherwise, store the item in the map using its 'orderId' as the key
    array.forEach(item => {
      if (!uniqueMap.has(item.orderId)) {
        uniqueMap.set(item.orderId, item);
      }
    });

    // Convert the map values back to an array to get the unique items, and sort them based on 'orderId'
    return Array.from(uniqueMap.values()).sort((a, b) => a.orderId - b.orderId);
  }

}
