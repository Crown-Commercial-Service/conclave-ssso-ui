import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ManageOrgRegDetailsWrongComponent } from './manage-organisation-registration-error-details-wrong.component';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('ManageOrgRegDetailsWrongComponent', () => {
  let component: ManageOrgRegDetailsWrongComponent;
  let fixture: ComponentFixture<ManageOrgRegDetailsWrongComponent>;
  let mockStore: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    mockStore = jasmine.createSpyObj('Store', ['select']);
    mockStore.select.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      declarations: [ManageOrgRegDetailsWrongComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Store, useValue: mockStore }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegDetailsWrongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the correct URL when continue button is clicked', () => {
    const routerSpy = spyOn(TestBed.inject(Router), 'navigateByUrl');

    component.onContinueClick('Continue');

    expect(routerSpy).toHaveBeenCalledWith(
      '/manage-org/register/user?data=' + btoa(JSON.stringify(0))
    );
  });

  it('should go back in history when goBack() function is called', () => {
    const historySpy = spyOn(window.history, 'back');

    component.goBack();

    expect(historySpy).toHaveBeenCalled();
  });
});
