import { PatternService } from './pattern.service';

describe('PatternService', () => {
  let patternService: PatternService;

  beforeEach(() => {
    patternService = new PatternService();
  });

  it('should validate email correctly', () => {
    expect(patternService.emailValidator('test@example.com')).toBeFalsy();

    expect(patternService.emailValidator('a'.repeat(257))).toBeTruthy();

    expect(
      patternService.emailValidator('a'.repeat(65) + '@example.com')
    ).toBeTruthy();

    expect(
      patternService.emailValidator('test@' + 'a'.repeat(64) + '.com')
    ).toBeTruthy();

    expect(
      patternService.emailValidator('test@example.' + 'a'.repeat(64))
    ).toBeTruthy();
  });
});
