import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { VerifyUserStatusComponent } from './verify-user-status.component';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

describe('VerifyUserStatusComponent', () => {
  let component: VerifyUserStatusComponent;
  let fixture: ComponentFixture<VerifyUserStatusComponent>;
  let titleService: jasmine.SpyObj<Title>;
  let activatedRoute: ActivatedRoute;
  let router: jasmine.SpyObj<Router>;
  let dataLayerService: jasmine.SpyObj<DataLayerService>;
  let sessionService: jasmine.SpyObj<SessionService>;

  beforeEach(waitForAsync(() => {
    titleService = jasmine.createSpyObj('Title', ['setTitle']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    dataLayerService = jasmine.createSpyObj('DataLayerService', ['pushPageViewEvent']);
    sessionService = jasmine.createSpyObj('SessionService', ['getSession']);
    
    activatedRoute = {
      queryParams: of({ data: btoa(JSON.stringify({ status: 'ERROR_USER_ALREADY_EXISTS' })) })
    } as any;

    TestBed.configureTestingModule({
      declarations: [VerifyUserStatusComponent],
      imports: [
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: Title, useValue: titleService },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: router },
        { provide: DataLayerService, useValue: dataLayerService },
        { provide: SessionService, useValue: sessionService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

     // Mock local storage
     spyOn(localStorage, 'getItem').and.callFake((key: string) => {
        if (key === 'isOrgAdmin') {
          return 'true';
        }
        return null;
      });

    fixture = TestBed.createComponent(VerifyUserStatusComponent);
    component = fixture.componentInstance;
   
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize isOrgAdmin correctly', () => {
    expect(component.isOrgAdmin).toBeTrue();
  });

  it('should call pushPageViewEvent on ngOnInit', () => {
    component.ngOnInit();
    expect(dataLayerService.pushPageViewEvent).toHaveBeenCalled();
  });

  it('should set userStatus and title correctly based on queryParams', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.userInfo).toEqual({ status: 'ERROR_USER_ALREADY_EXISTS' });
    expect(component.userStatus).toBe(0);
    expect(titleService.setTitle).toHaveBeenCalledWith('Account already created  - CCS');
  });

  it('should handle UNAUTHORIZED status correctly', () => {
    activatedRoute.queryParams = of({ data: btoa(JSON.stringify({ status: 'UNAUTHORIZED' })) });

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.userStatus).toBe(1);
    expect(titleService.setTitle).toHaveBeenCalledWith('User not created  - CCS');
  });

  it('should handle link expired status correctly', () => {
    activatedRoute.queryParams = of({ data: btoa(JSON.stringify({ status: 'ERROR_LINK_EXPIRED' })) });

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.userStatus).toBe(2);
    expect(titleService.setTitle).toHaveBeenCalledWith('User not created  - CCS');
  });

  it('should handle invalid user details status correctly', () => {
    activatedRoute.queryParams = of({ data: btoa(JSON.stringify({ status: 'INVALID_USER_DETAIL' })) });

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.userStatus).toBe(3);
    expect(titleService.setTitle).toHaveBeenCalledWith('Error  - CCS');
  });

  it('should handle unknown status correctly', () => {
    activatedRoute.queryParams = of({ data: btoa(JSON.stringify({ status: 'UNKNOWN_STATUS' })) });

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.userStatus).toBe(0);  // Default value, no change
    expect(titleService.setTitle).not.toHaveBeenCalled();
  });
});
