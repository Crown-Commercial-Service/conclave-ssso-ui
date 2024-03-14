import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { UserContactEditComponent } from './user-contact-edit.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('UserContactEditComponent', () => {
  let component: UserContactEditComponent;
  let fixture: ComponentFixture<UserContactEditComponent>;
  let storeMock: jasmine.SpyObj<Store<any>>;

  beforeEach(async () => {
    storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      declarations: [UserContactEditComponent],
      providers: [{ provide: Store, useValue: storeMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserContactEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize the component', () => {
      const contactReasons = [
        { key: 'Reason 1', value: 'Reason 1' },
        { key: 'Reason 2', value: 'Reason 2' },
      ];
      const contactInfo = {
        contactPointName: 'John Doe',
        contacts: [],
        contactPointReason: 'Reason 1',
      };

      spyOn(
        component.externalContactService,
        'getContactReasons'
      ).and.returnValue(of(contactReasons));
      spyOn(component.contactService, 'getUserContactById').and.returnValue(
        of(contactInfo)
      );

      component.ngOnInit();

      expect(component.contactReasons).toEqual(contactReasons);
    });
  });

  describe('onCancelClick', () => {
    it('should navigate to the profile page', () => {
      spyOn(component.router, 'navigateByUrl');

      component.onCancelClick();

      expect(component.router.navigateByUrl).toHaveBeenCalledWith('profile');
    });
  });

  describe('onDeleteClick', () => {
    it('should navigate to the delete contact page', () => {
      spyOn(component.router, 'navigateByUrl');

      component.onDeleteClick();

      expect(component.router.navigateByUrl).toHaveBeenCalledWith(
        'user-contact-delete?data={"contactId":0}'
      );
    });
  });
});
