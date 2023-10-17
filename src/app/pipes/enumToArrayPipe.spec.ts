import { EnumToArrayPipe } from './enumToArrayPipe';

describe('EnumToArrayPipe', () => {
  let pipe: EnumToArrayPipe;

  beforeEach(() => {
    pipe = new EnumToArrayPipe();
  });

  it('should transform an enum object to an array of numbers', () => {
    const enumObject = {
      1: 'data 1',
      2: 'data 2',
      3: 'data 3',
    };

    const result = pipe.transform(enumObject);

    expect(result).toEqual([1, 2, 3]);
  });

  it('should ignore non-numeric keys in the enum object', () => {
    const enumObject = {
      1: 'data 1',
      2: 'data 2',
      3: 'data 3',
      NonNumericKey: 'abc',
    };

    const result = pipe.transform(enumObject);

    expect(result).toEqual([1, 2, 3]);
  });
});
