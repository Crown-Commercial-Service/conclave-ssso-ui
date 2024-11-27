import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'scheme'
})
export class SchemePipe implements PipeTransform {
  public schemeOrder = [
    {
        "scheme": "GB-COH",
        "orderId": 1
    },
    {
        "scheme": "US-DUN",
        "orderId": 2
    },
    {
        "scheme": "GB-CHC",
        "orderId": 3
    },
    {
        "scheme": "GB-SC",
        "orderId": 4
    },
    {
        "scheme": "GB-NIC",
        "orderId": 5
    },
    {
        "scheme": "GB-NHS",
        "orderId": 6
    },
    {
        "scheme": "GB-EDU",
        "orderId": 7
    },
    {
        "scheme": "GB-PPG",
        "orderId": 8
    }
]

  transform(value: any, ...args: any[]): any {
    let unOrderData:any = []
    value.forEach((data:any) => {
    const foundItem:any = this.schemeOrder.find(item => item.scheme === data.scheme);
    data.orderId = foundItem.orderId
      unOrderData.push(data)
    })
    return this.orderDetails(unOrderData)
  }

  private orderDetails(array:any[]):any{
    return array.sort((a, b) => a.orderId - b.orderId);
}
}
