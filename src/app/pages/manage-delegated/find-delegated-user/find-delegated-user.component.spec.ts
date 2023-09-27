import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FindDelegatedUserComponent } from './find-delegated-user.component';
import { Router } from '@angular/router';

describe('FindDelegatedUserComponent', () => {
  let component: FindDelegatedUserComponent;
  let fixture: ComponentFixture<FindDelegatedUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FindDelegatedUserComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [TranslateService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindDelegatedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty email field', () => {
    expect(component.formGroup.get('email')!.value).toEqual('');
  });

  it('should set focus to email field', () => {
    const emailInput = fixture.nativeElement.querySelector('#email');
    jest.spyOn(emailInput, 'focus');
    component.setFocus({});
    expect(emailInput.focus).toHaveBeenCalled();
  });

  it('should navigate to previous page on cancel', () => {
    const windowSpy = jest.spyOn(window.history, 'back');
    component.Cancel();
    expect(windowSpy).toHaveBeenCalled();
  });
});
