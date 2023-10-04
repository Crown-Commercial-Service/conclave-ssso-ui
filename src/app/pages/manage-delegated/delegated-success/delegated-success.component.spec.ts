import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DelegatedSuccessComponent } from './delegated-success.component';
import { TranslateModule } from '@ngx-translate/core';

describe('DelegatedSuccessComponent', () => {
  let component: DelegatedSuccessComponent;
  let fixture: ComponentFixture<DelegatedSuccessComponent>;
  let mockActivatedRoute: any;
  let mockTitleService: any;

  beforeEach(async () => {
    mockActivatedRoute = {
      queryParams: {
        subscribe: jasmine
          .createSpy('subscribe')
          .and.callFake((callback: any) => {
            callback(atob(JSON.stringify({ data: 'mockData' })));
          }),
      },
    };
    mockTitleService = {
      setTitle: jasmine.createSpy('setTitle'),
    };

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [DelegatedSuccessComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Title, useValue: mockTitleService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegatedSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the page title when status is "create"', () => {
    expect(mockTitleService.setTitle).toHaveBeenCalledWith(
      'Delegated user successfully added - CCS'
    );
  });

  it('should parse the user info from query parameters', () => {
    expect(component.userInfo).toEqual({ data: 'mockData' });
  });

  it('should decode the user name', () => {
    expect(component.userInfo.userName).toBeUndefined();
    fixture.detectChanges();
    expect(component.userInfo.userName).toBe('decodedUserName');
  });
});
