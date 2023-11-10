import { TestBed } from '@angular/core/testing';
import { SharedDataService } from './shared-data.service';

describe('SharedDataService', () => {
  let service: SharedDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store and retrieve ManageGroup value from sessionStorage', () => {
    const testGName = 'Test Group';
    service.manageGroupStorage(testGName);
    expect(service.GName).toEqual(testGName);
  });

  it('should store and retrieve userEditDetails value from localStorage', () => {
    const testUserEditDetails = { name: 'John Doe' };
    service.storeUserDetails(JSON.stringify(testUserEditDetails));
    expect(service.userName).toEqual(testUserEditDetails);
  });

  it('should store and retrieve roleForGroup value from localStorage', () => {
    const testRoleForGroup = 'Admin';
    service.storeRoleForGroup(JSON.stringify(testRoleForGroup));
    expect(service.roleForGroup).toEqual(testRoleForGroup);
  });

  it('should check if an item scheme is blocked', () => {
    const blockedScheme = 'BlockedScheme';
    service.blockedScheme = ['BlockedScheme'];
    expect(service.checkBlockedScheme({ scheme: blockedScheme })).toBeFalse();
    expect(service.checkBlockedScheme({ scheme: 'OtherScheme' })).toBeTrue();
  });

  it('should check if an item text is blocked', () => {
    const blockedText = 'BlockedText';
    service.blockedScheme = ['BlockedText'];
    expect(service.checkBlockedSchemeText(blockedText)).toBeFalse();
    expect(service.checkBlockedSchemeText('OtherText')).toBeTrue();
  });

  it('should convert id to hyphenated id for GB-PPG schema', () => {
    const testId = '123456789';
    const hyphenatedId = '123-456-789';
    expect(service.getId(testId, 'GB-PPG')).toEqual(hyphenatedId);
  });

  it('should return id as is for other schemas', () => {
    const testId = '123456789';
    expect(service.getId(testId, 'OtherSchema')).toEqual(testId);
  });
});
