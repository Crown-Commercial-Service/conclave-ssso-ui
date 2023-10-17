import { TestBed } from '@angular/core/testing';
import { FormGroup, FormControl } from '@angular/forms';
import { ContactHelper } from './contact-helper.service';
import {
  ContactDetail,
  ContactPoint,
  VirtualContactType,
} from 'src/app/models/contactInfo';

describe('ContactHelper', () => {
  let contactHelper: ContactHelper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContactHelper],
    });
    contactHelper = TestBed.inject(ContactHelper);
  });

  it('should return contact value from contact list', () => {
    const contactType = VirtualContactType.EMAIL;
    const contacts: ContactDetail[] = [
      {
        contactType: VirtualContactType.EMAIL,
        contactValue: 'test@example.com',
      },
      { contactType: VirtualContactType.PHONE, contactValue: '+123456789' },
    ];

    const result = contactHelper.getContactValueFromContactList(
      contactType,
      contacts
    );

    expect(result).toEqual('test@example.com');
  });

  it('should return null if contact type not found', () => {
    const contactType = VirtualContactType.FAX;
    const contacts: ContactDetail[] = [
      {
        contactType: VirtualContactType.EMAIL,
        contactValue: 'test@example.com',
      },
      { contactType: VirtualContactType.PHONE, contactValue: '+123456789' },
    ];

    const result = contactHelper.getContactValueFromContactList(
      contactType,
      contacts,
      true
    );

    expect(result).toBeNull();
  });

  it('should return empty string if contact type not found and returnNull is false', () => {
    const contactType = VirtualContactType.FAX;
    const contacts: ContactDetail[] = [
      {
        contactType: VirtualContactType.EMAIL,
        contactValue: 'test@example.com',
      },
      { contactType: VirtualContactType.PHONE, contactValue: '+123456789' },
    ];

    const result = contactHelper.getContactValueFromContactList(
      contactType,
      contacts,
      false
    );

    expect(result).toEqual('');
  });

  it('should return contact list from form', () => {
    const form = new FormGroup({
      email: new FormControl('test@example.com'),
      phone: new FormControl({ e164Number: '+123456789' }),
      fax: new FormControl({ e164Number: '+987654321' }),
      mobile: new FormControl({ e164Number: '+9876543210' }),
      webUrl: new FormControl('https://example.com'),
    });

    const result = contactHelper.getContactListFromForm(form);

    expect(result).toEqual([
      {
        contactType: VirtualContactType.EMAIL,
        contactValue: 'test@example.com',
      },
      { contactType: VirtualContactType.PHONE, contactValue: '+123456789' },
      { contactType: VirtualContactType.FAX, contactValue: '+987654321' },
      { contactType: VirtualContactType.MOBILE, contactValue: '+9876543210' },
      {
        contactType: VirtualContactType.URL,
        contactValue: 'https://example.com',
      },
    ]);
  });

  it('should return contact grid info list', () => {
    const contactPoints: ContactPoint[] = [
      {
        contactPointId: 1,
        contactPointReason: 'General Inquiry',
        contactPointName: 'John Doe',
        contacts: [
          {
            contactType: VirtualContactType.EMAIL,
            contactValue: 'john@example.com',
          },
          { contactType: VirtualContactType.PHONE, contactValue: '+123456789' },
        ],
      },
      {
        contactPointId: 2,
        contactPointReason: 'Support',
        contactPointName: 'Jane Smith',
        contacts: [
          {
            contactType: VirtualContactType.EMAIL,
            contactValue: 'jane@example.com',
          },
          { contactType: VirtualContactType.PHONE, contactValue: '+987654321' },
        ],
      },
    ];

    const result = contactHelper.getContactGridInfoList(contactPoints);

    expect(result).toEqual([
      {
        contactId: 1,
        contactReason: 'General Inquiry',
        name: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '+123456789',
        fax: '',
        webUrl: '',
        mobileNumber: '',
      },
      {
        contactId: 2,
        contactReason: 'Support',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phoneNumber: '+987654321',
        fax: '',
        webUrl: '',
        mobileNumber: '',
      },
    ]);
  });
});
