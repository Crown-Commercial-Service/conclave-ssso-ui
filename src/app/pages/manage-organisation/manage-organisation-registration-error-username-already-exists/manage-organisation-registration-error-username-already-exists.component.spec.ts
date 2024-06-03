import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { ManageOrgRegErrorUsernameExistsComponent } from './manage-organisation-registration-error-username-already-exists.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

describe('ManageOrgRegErrorUsernameExistsComponent', () => {
  let component: ManageOrgRegErrorUsernameExistsComponent;
  let fixture: ComponentFixture<ManageOrgRegErrorUsernameExistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageOrgRegErrorUsernameExistsComponent],
      imports: [
        RouterTestingModule,
        StoreModule.forRoot({}),
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegErrorUsernameExistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to previous page when goBack() is called', () => {
    spyOn(window.history, 'back');
    component.goBack();
    expect(window.history.back).toHaveBeenCalled();
  });

  it('should navigate to confirm organization page when goConfirmOrgPage() is called', () => {
    const schemeDetails = {
      scheme: 'abc',
      schemeID: '123',
    };

    localStorage.setItem('schemeDetails', JSON.stringify(schemeDetails));
    // spyOn(component.router, 'navigateByUrl');
    const routerSpy = spyOn(TestBed.inject(Router), 'navigateByUrl');
    component.goConfirmOrgPage();
    expect(routerSpy).toHaveBeenCalledWith(
      `manage-org/register/search/${
        schemeDetails.scheme
      }?id=${encodeURIComponent(schemeDetails.schemeID)}`
    );
  });
});
