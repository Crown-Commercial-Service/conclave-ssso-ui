import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { of } from 'rxjs';
import { DelegatedUserConfirmComponent } from './delegated-user-confirm.component';

describe('DelegatedUserConfirmComponent', () => {
  let component: DelegatedUserConfirmComponent;
  let fixture: ComponentFixture<DelegatedUserConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [DelegatedUserConfirmComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ data: '' }),
          },
        },
        Title,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegatedUserConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the page title based on the access mode', () => {
    const titleService = TestBed.inject(Title);
    const spySetTitle = jest.spyOn(titleService, 'setTitle');

    component.ngOnInit();

    expect(spySetTitle).toHaveBeenCalledWith('Confirm Delegation - CCS');
  });

  it('should populate the user information and selected user info', () => {
    const activatedRoute = TestBed.inject(ActivatedRoute);
    const mockQueryParams = { data: '' };
    jest
      .spyOn(activatedRoute, 'queryParams', 'get')
      .mockReturnValue(of(mockQueryParams));

    component.ngOnInit();

    expect(component.userInfo).toEqual({});
    expect(component.UserSelectedinfo).toEqual({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
