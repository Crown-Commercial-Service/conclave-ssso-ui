import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactAssignComponent } from './contact-assign-component';
import { WrapperUserContactService } from 'src/app/services/wrapper/wrapper-user-contact.service';
import { WrapperSiteContactService } from 'src/app/services/wrapper/wrapper-site-contact-service';
import { ContactHelper } from 'src/app/services/helper/contact-helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('ContactAssignComponent', () => {
  let component: ContactAssignComponent;
  let fixture: ComponentFixture<ContactAssignComponent>;
  let userContactService: jasmine.SpyObj<WrapperUserContactService>;
  let siteContactService: jasmine.SpyObj<WrapperSiteContactService>;
  let activatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let router: jasmine.SpyObj<Router>;
  let contactHelper: jasmine.SpyObj<ContactHelper>;
  let store: jasmine.SpyObj<Store>;

  beforeEach(() => {
    userContactService = jasmine.createSpyObj('WrapperUserContactService', [
      'getUserContacts',
    ]);
    siteContactService = jasmine.createSpyObj('WrapperSiteContactService', [
      'getSiteContacts',
    ]);
    activatedRoute = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: { queryParams: of({ data: '{}' }) },
    });
    router = jasmine.createSpyObj('Router', ['navigateByUrl']);
    contactHelper = jasmine.createSpyObj('ContactHelper', [
      'getContactGridInfoList',
    ]);
    store = jasmine.createSpyObj('Store', ['select', 'dispatch']);
    TestBed.configureTestingModule({
      declarations: [ContactAssignComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        WrapperUserContactService,
        WrapperSiteContactService,
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: router },
        { provide: ContactHelper, useValue: contactHelper },
        { provide: Store, useValue: store },
      ],
    });

    fixture = TestBed.createComponent(ContactAssignComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call onCheckBoxClickRow correctly when isChecked is true', () => {
    const dataRow = { contactId: 1, isChecked: true };
    component.selectedContacts = [];
    component.onCheckBoxClickRow(dataRow);
    expect(component.selectedContacts).toContain(dataRow);
  });

  it('should call onCheckBoxClickRow correctly when isChecked is false', () => {
    const dataRow = { contactId: 1, isChecked: false };
    component.selectedContacts = [dataRow];
    component.onCheckBoxClickRow(dataRow);
    expect(component.selectedContacts).not.toContain(dataRow);
  });

  it('should call onContinueClick correctly', () => {
    const data = { assigningSiteId: 0, assigningOrgId: '', contactSiteId: 0 }; 
    spyOn(sessionStorage, 'setItem');
    component.selectedContacts = [{ contactId: 1, isChecked: true }];
    component.onContinueClick();
    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      'assigning-contact-list',
      JSON.stringify(component.selectedContacts)
    );

    expect(component.router.navigateByUrl).toHaveBeenCalledWith(
      'contact-assign/confirm?data=' + JSON.stringify(data)
    );
  });

  it('should call onNavigateToHomeClick correctly', () => {
    spyOn(sessionStorage, 'removeItem');
    component.onNavigateToHomeClick();
    expect(sessionStorage.removeItem).toHaveBeenCalledWith(
      'assigning-contact-list'
    );
    expect(component.router.navigateByUrl).toHaveBeenCalledWith('/home');
  });
});