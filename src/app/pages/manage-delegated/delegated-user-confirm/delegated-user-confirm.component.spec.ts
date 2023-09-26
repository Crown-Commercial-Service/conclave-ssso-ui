import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';
import { DelegatedUserConfirmComponent } from './delegated-user-confirm.component';

describe('DelegatedUserConfirmComponent', () => {
  let component: DelegatedUserConfirmComponent;
  let fixture: ComponentFixture<DelegatedUserConfirmComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let delegatedService: WrapperUserDelegatedService;
  let titleService: Title;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DelegatedUserConfirmComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: WrapperUserDelegatedService, useValue: delegatedService },
        { provide: Title, useValue: titleService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegatedUserConfirmComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    delegatedService = TestBed.inject(WrapperUserDelegatedService);
    titleService = TestBed.inject(Title);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the page title correctly for "edit" mode', () => {
    component.pageAccessMode = 'edit';
    spyOn(titleService, 'setTitle');
    fixture.detectChanges();
    expect(titleService.setTitle).toHaveBeenCalledWith(
      'Confirm Delegation - CCS'
    );
  });

  it('should set the page title correctly for "add" mode', () => {
    component.pageAccessMode = 'add';
    spyOn(titleService, 'setTitle');
    fixture.detectChanges();
    expect(titleService.setTitle).toHaveBeenCalledWith(
      'Confirm Delegation - CCS'
    );
  });

  it('should call createDelegateUser() when onSubmit() is called in "add" mode', () => {
    component.pageAccessMode = 'add';
    spyOn(component, 'createDelegateUser');
    component.onSubmit();
    expect(component.createDelegateUser).toHaveBeenCalled();
  });

  it('should call updateDelegatedUser() when onSubmit() is called in "edit" mode', () => {
    component.pageAccessMode = 'edit';
    spyOn(component, 'updateDelegatedUser');
    component.onSubmit();
    expect(component.updateDelegatedUser).toHaveBeenCalled();
  });
});
