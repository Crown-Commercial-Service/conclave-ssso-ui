import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { dataService } from 'src/app/services/data/data.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { UIState } from 'src/app/store/ui.states';
import { ManageOrganisationRegistryAddConfirmationComponent } from './manage-organisation-profile-registry-add-confirmed.component';
import { TranslateModule } from '@ngx-translate/core';

describe('ManageOrganisationRegistryAddConfirmationComponent', () => {
  let component: ManageOrganisationRegistryAddConfirmationComponent;
  let fixture: ComponentFixture<ManageOrganisationRegistryAddConfirmationComponent>;
  let dataServiceSpy: jasmine.SpyObj<dataService>;
  let route: ActivatedRoute;
  let storeSpy: jasmine.SpyObj<Store<UIState>>;
  let routerStub: Partial<Router>;

  beforeEach(async () => {
    dataServiceSpy = jasmine.createSpyObj('dataService', ['']);
    storeSpy = jasmine.createSpyObj('Store', ['select']);
    routerStub = {
      navigateByUrl: jasmine.createSpy('navigateByUrl'),
    };

    await TestBed.configureTestingModule({
      declarations: [ManageOrganisationRegistryAddConfirmationComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: dataService, useValue: dataServiceSpy },
        { provide: Router, useValue: routerStub },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
        { provide: Store, useValue: storeSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ManageOrganisationRegistryAddConfirmationComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display success message', () => {
    const successMsg = fixture.nativeElement.querySelector('.success_msg');
    expect(successMsg.textContent).toContain(
      'You have successfully added to your organisation'
    );
  });
});
