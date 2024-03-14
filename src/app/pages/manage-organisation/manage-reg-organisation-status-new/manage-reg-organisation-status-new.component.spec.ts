import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ManageOrgRegSearchStatusNewComponent } from './manage-reg-organisation-status-new.component';

describe('ManageOrgRegSearchStatusNewComponent', () => {
  let component: ManageOrgRegSearchStatusNewComponent;
  let fixture: ComponentFixture<ManageOrgRegSearchStatusNewComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageOrgRegSearchStatusNewComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegSearchStatusNewComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it("should navigate to 'manage-org/register/newreg' when onContinueNotRegistered() is called", () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.onContinueNotRegistered();
    expect(navigateSpy).toHaveBeenCalledWith('manage-org/register/newreg');
  });

  it('should navigate back when goBack() is called', () => {
    const historyBackSpy = spyOn(window.history, 'back');
    component.goBack();
    expect(historyBackSpy).toHaveBeenCalled();
  });
});
