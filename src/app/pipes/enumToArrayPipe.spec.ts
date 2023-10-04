import { EnumToArrayPipe } from './enumToArrayPipe';

describe('EnumToArrayPipe', () => {
  let pipe: EnumToArrayPipe;

  beforeEach(() => {
    pipe = new EnumToArrayPipe();
  });

  it('should return an empty array if no valid numbers are found', () => {
    const data = {
      Key1: 'invalid',
      Key2: 'invalid',
      Key3: 'invalid',
    };
    const expectedOutput: number[] = [];

    const transformedData = pipe.transform(data);

    expect(transformedData).toEqual(expectedOutput);
  });
});
