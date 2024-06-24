import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaintenanceComponent } from './maintenance.component';
import { Store, StoreModule } from '@ngrx/store';
import { ViewportScroller } from '@angular/common';
import { Router } from '@angular/router';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { BaseComponent } from 'src/app/components/base/base.component';
import { slideAnimation } from 'src/app/animations/slide.animation';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MaintenanceComponent', () => {
  let component: MaintenanceComponent;
  let fixture: ComponentFixture<MaintenanceComponent>;
  let dataLayerService: jasmine.SpyObj<DataLayerService>;

  beforeEach(async () => {
    const dataLayerServiceSpy = jasmine.createSpyObj('DataLayerService', ['pushPageViewEvent']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        
    await TestBed.configureTestingModule({
      declarations: [MaintenanceComponent],
      imports: [StoreModule.forRoot({})],
      providers: [
        { provide: DataLayerService, useValue: dataLayerServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: SessionService},
        { provide: ScrollHelper },
        { provide: ViewportScroller },
        Store
      ],      
    }).compileComponents();

    fixture = TestBed.createComponent(MaintenanceComponent);
    component = fixture.componentInstance;
    dataLayerService = TestBed.inject(DataLayerService) as jasmine.SpyObj<DataLayerService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call pushPageViewEvent on ngOnInit', () => {
    component.ngOnInit();
    expect(dataLayerService.pushPageViewEvent).toHaveBeenCalled();
  });
});
