import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewportScroller } from '@angular/common';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { OrgRegDetails } from './reg-org-details.component';
import { ciiService } from 'src/app/services/cii/cii.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

describe('OrgRegDetailsComponent', () => {
  let component: OrgRegDetails;
  let fixture: ComponentFixture<OrgRegDetails>;
  let ciiServiceMock: jasmine.SpyObj<ciiService>;
  let storeMock: jasmine.SpyObj<Store<any>>;

  beforeEach(async () => {
    const viewportScrollerSpy = jasmine.createSpyObj('ViewportScroller', [
      'setOffset',
    ]);

    ciiServiceMock = jasmine.createSpyObj('ciiService', [
      'getIdentifierDetails',
      'getOrgDetails',
    ]);
    storeMock = jasmine.createSpyObj('Store', ['select']);

    await TestBed.configureTestingModule({
      declarations: [OrgRegDetails],
      imports:[        
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: ciiService, useValue: ciiServiceMock },
        { provide: Store, useValue: storeMock },
        {
          provide: ViewportScroller,
          useValue: viewportScrollerSpy,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgRegDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load data on ngOnChanges', async () => {
    component.ciiOrgId = '123';
    component.ciiRegNumber = '';
    spyOn(component, 'loadData');

    component.ngOnChanges();

    expect(component.loadData).toHaveBeenCalled();
  });

  it('should load data on ngOnInit', async () => {
    spyOn(component, 'loadData');

    component.ngOnInit();

    expect(component.loadData).toHaveBeenCalled();
  });
});
