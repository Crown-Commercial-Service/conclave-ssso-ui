import { PermissionPipe } from './permission.pipe';

describe('PermissionPipe', () => {
  let pipe: PermissionPipe;

  beforeEach(() => {
    pipe = new PermissionPipe();
  });

  it('should sort the array based on orderId', () => {
    const inputArray = [
      { orderId: 3, name: 'Permission C' },
      { orderId: 1, name: 'Permission A' },
      { orderId: 2, name: 'Permission B' },
    ];
    const expectedArray = [
      { orderId: 1, name: 'Permission A' },
      { orderId: 2, name: 'Permission B' },
      { orderId: 3, name: 'Permission C' },
    ];

    const transformedArray = pipe.transform(inputArray);

    expect(transformedArray).toEqual(expectedArray);
  });

  it('should return the input array if it is empty', () => {
    const inputArray: any[] = [];
    const transformedArray = pipe.transform(inputArray);

    expect(transformedArray).toEqual(inputArray);
  });

  it('should return the input array if it has only one element', () => {
    const inputArray = [{ orderId: 1, name: 'Permission A' }];
    const transformedArray = pipe.transform(inputArray);

    expect(transformedArray).toEqual(inputArray);
  });
});
