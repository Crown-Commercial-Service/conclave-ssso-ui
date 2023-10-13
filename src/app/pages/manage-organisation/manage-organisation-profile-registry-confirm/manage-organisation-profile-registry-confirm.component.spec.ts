import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ManageOrganisationRegistryConfirmComponent } from './manage-organisation-profile-registry-confirm.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Store } from '@ngrx/store';
import { TokenService } from 'src/app/services/auth/token.service';

describe('ManageOrganisationRegistryConfirmComponent', () => {
  let component: ManageOrganisationRegistryConfirmComponent;
  let fixture: ComponentFixture<ManageOrganisationRegistryConfirmComponent>;
  let router: Router;
  let activatedRouteStub: Partial<ActivatedRoute>;

  beforeEach(async () => {
    activatedRouteStub = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: { queryParams: { id: '123' } },
      params: of({ scheme: 'GB-COH' }),
    });

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [ManageOrganisationRegistryConfirmComponent],
      providers: [
        { provide: Store, useFactory: () => ({}) },
        TokenService,
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ManageOrganisationRegistryConfirmComponent
    );
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    localStorage.setItem('cii_organisation_id', 'some_value');
    localStorage.setItem('scheme_name', 'some_value');

    spyOn(
      component.ciiService,
      'getOrganisationIdentifierDetails'
    ).and.returnValue(of({}));
    spyOn(component.ciiService, 'addRegistry').and.returnValue(of({}));

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component', () => {
    expect(component.organisationId).toBe('some_value');
    expect(component.id).toBe('123');
    expect(component.schemeName).toBe('some_value');
  });

  it('should handle form submission correctly', () => {
    spyOn(router, 'navigateByUrl');

    component.detailValidityOption = 'CorrectOrganisation';
    component.onSubmit();

    expect(component.ciiService.addRegistry).toHaveBeenCalledWith(
      'some_value',
      'GB-COH',
      '123'
    );

    expect(router.navigateByUrl).toHaveBeenCalledWith(
      'manage-org/profile/some_value/registry/confirmation/GB-COH/123'
    );
  });
});
