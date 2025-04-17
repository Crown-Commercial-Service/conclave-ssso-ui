import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ManageOrgRegDetailsWrongComponent } from './manage-organisation-registration-error-details-wrong.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

describe('ManageOrgRegDetailsWrongComponent', () => {
  let component: ManageOrgRegDetailsWrongComponent;
  let fixture: ComponentFixture<ManageOrgRegDetailsWrongComponent>;
  let mockStore: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    mockStore = jasmine.createSpyObj('Store', ['select']);
    mockStore.select.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      declarations: [ManageOrgRegDetailsWrongComponent],
      providers: [{ provide: Store, useValue: mockStore }],
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
