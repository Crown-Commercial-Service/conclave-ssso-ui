import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { ViewportScroller } from '@angular/common';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { ManageOrgRegRightToBuyComponent } from './manage-organisation-registration-type.component';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';

describe('ManageOrgRegRightToBuyComponent', () => {
  let component: ManageOrgRegRightToBuyComponent;
  let fixture: ComponentFixture<ManageOrgRegRightToBuyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TranslateModule.forRoot()],
      declarations: [ManageOrgRegRightToBuyComponent],
      providers: [
        provideRouter([]),
        { provide: Store, useFactory: () => ({}) },
        ViewportScroller,
        ScrollHelper,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegRightToBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set defaultChoice to "supplier" initially', () => {
    expect(component.defaultChoice).toBe('supplier');
  });

  it('should navigate back when onBackClick() is called', () => {
    spyOn(window.history, 'back');
    component.onBackClick();
    expect(window.history.back).toHaveBeenCalled();
  });

  it('should set localStorage item and navigate to appropriate route when onSubmit() is called', () => {
    spyOn(localStorage, 'setItem');
    spyOn(component.router, 'navigateByUrl');

    component.onSubmit('Continue');

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'manage-org_reg_type',
      component.defaultChoice
    );
    expect(component.router.navigateByUrl).toHaveBeenCalledWith(
      'manage-org/register/buyer-type'
    );
  });
});
