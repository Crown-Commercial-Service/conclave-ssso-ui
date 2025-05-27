import { SchemePipe } from './scheme.pipe';

describe('SchemePipe', () => {
  let pipe: SchemePipe;

  beforeEach(() => {
    pipe = new SchemePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should order the data by scheme order', () => {
    const testData = [
      { scheme: 'GB-SC', data: 'test data' },
      { scheme: 'GB-NHS', data: 'test data' },
      { scheme: 'GB-EDU', data: 'test data' },
      { scheme: 'GB-COH', data: 'test data' },
      { scheme: 'GB-PPG', data: 'test data' },
      { scheme: 'GB-CHC', data: 'test data' },
      { scheme: 'GB-NIC', data: 'test data' },
      { scheme: 'US-DUN', data: 'test data' },
    ];

    const expectedData = [
      { scheme: 'GB-COH', data: 'test data', orderId: 1 },
      { scheme: 'US-DUN', data: 'test data', orderId: 2 },
      { scheme: 'GB-CHC', data: 'test data', orderId: 3 },
      { scheme: 'GB-SC', data: 'test data', orderId: 4 },
      { scheme: 'GB-NIC', data: 'test data', orderId: 5 },
      { scheme: 'GB-NHS', data: 'test data', orderId: 6 },
      { scheme: 'GB-EDU', data: 'test data', orderId: 7 },
      { scheme: 'GB-PPG', data: 'test data', orderId: 8 },
    ];

    expect(pipe.transform(testData)).toEqual(expectedData);
  });
});
