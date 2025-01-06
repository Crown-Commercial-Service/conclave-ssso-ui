import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { CIIOrgDetails } from './cii-details.component';
import { ciiService } from 'src/app/services/cii/cii.service';

describe('CIIOrgDetails', () => {
  let component: CIIOrgDetails;
  let fixture: ComponentFixture<CIIOrgDetails>;
  let ciiServiceMock: jasmine.SpyObj<ciiService>;
  let routerMock: jasmine.SpyObj<Router>;
  let activatedRouteMock: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    ciiServiceMock = jasmine.createSpyObj('ciiService', [
      'getIdentifierDetails',
    ]);
    routerMock = jasmine.createSpyObj('Router', ['navigateByUrl']);
    activatedRouteMock = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: { queryParams: { id: '123', scheme: 'GB-COH' } },
      params: of({ scheme: 'test' }),
    });

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, StoreModule.forRoot({})],
      declarations: [CIIOrgDetails],
      providers: [
        { provide: ciiService, useValue: ciiServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CIIOrgDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should handle error responses when fetching identifier details', () => {
    const errorResponse = { status: '404' };
    ciiServiceMock.getIdentifierDetails.and.returnValue(
      throwError(errorResponse)
    );

    component.ngOnInit();

    expect(routerMock.navigateByUrl).toHaveBeenCalledWith(
      'manage-org/register/error/notfound'
    );
  });
});
