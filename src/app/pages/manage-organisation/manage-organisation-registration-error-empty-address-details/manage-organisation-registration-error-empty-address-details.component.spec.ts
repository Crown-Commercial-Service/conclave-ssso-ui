import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageOrgRegErrorAddressDetailsComponent } from './manage-organisation-registration-error-empty-address-details.component';
import { Router, NavigationStart } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { ViewportScroller } from '@angular/common';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { dataService } from 'src/app/services/data/data.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('ManageOrgRegErrorAddressDetailsComponent', () => {
  let component: ManageOrgRegErrorAddressDetailsComponent;
  let fixture: ComponentFixture<ManageOrgRegErrorAddressDetailsComponent>;
  let router: Router;
  let dataLayerService: jasmine.SpyObj<DataLayerService>;

  beforeEach(async () => {    
    const routerSpy = {
      events: of(new NavigationStart(1, 'testUrl', 'popstate')),
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };
    
    const dataLayerServiceSpy = jasmine.createSpyObj('DataLayerService', ['pushPageViewEvent']);

    await TestBed.configureTestingModule({
      declarations: [ManageOrgRegErrorAddressDetailsComponent],
      imports: [StoreModule.forRoot({}), 
        TranslateModule.forRoot(),    
    ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: dataService },
        { provide: Router, useValue: routerSpy },
        { provide: SessionService},
        { provide: ScrollHelper},
        { provide: ViewportScroller },
        { provide: DataLayerService, useValue: dataLayerServiceSpy },
        Store
      ],      
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageOrgRegErrorAddressDetailsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    dataLayerService = TestBed.inject(DataLayerService) as jasmine.SpyObj<DataLayerService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call pushPageViewEvent on ngOnInit', () => {
    component.ngOnInit();
    expect(dataLayerService.pushPageViewEvent).toHaveBeenCalled();
  });

  it('should navigate to "manage-org/register/search" on back navigation', () => {
    component.ngOnInit();
    expect(router.navigateByUrl).toHaveBeenCalledWith('manage-org/register/search');
  });
});
