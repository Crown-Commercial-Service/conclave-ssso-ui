import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DelegatedSuccessComponent } from './delegated-success.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('DelegatedSuccessComponent', () => {
  let component: DelegatedSuccessComponent;
  let fixture: ComponentFixture<DelegatedSuccessComponent>;
  let activatedRouteMock: any;
  let titleServiceMock: any;

  beforeEach(async () => {
    activatedRouteMock = {
      queryParams: {
        subscribe: jest.fn(),
      },
    };

    titleServiceMock = {
      setTitle: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [DelegatedSuccessComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Title, useValue: titleServiceMock },
        TranslateService,
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
    const mockUserInfo = btoa(
      JSON.stringify({ status: 'create', userName: 'John Doe' })
    );
    const mockQueryParams = { data: mockUserInfo };

    activatedRouteMock.queryParams.subscribe.mockImplementation(
      (callback: any) => {
        callback(mockQueryParams);
      }
    );

    component.ngOnInit();

    expect(titleServiceMock.setTitle).toHaveBeenCalledWith(
      'Delegated user successfully added - CCS'
    );
  });
});
