import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ManageOrgRegAdditionalIdentifiersComponent } from './manage-organisation-registration-additional-identifiers.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

describe('ManageOrgRegAdditionalIdentifiersComponent', () => {
  let component: ManageOrgRegAdditionalIdentifiersComponent;
  let fixture: ComponentFixture<ManageOrgRegAdditionalIdentifiersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageOrgRegAdditionalIdentifiersComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ scheme: 'example', id: '123' }),
          },
        },
        { provide: Store, useFactory: () => ({}) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ManageOrgRegAdditionalIdentifiersComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should handle route params and fetch organisation from local storage', () => {
    const params = { scheme: 'example', id: '123' };
    const organisation = {
      additionalIdentifiers: [
        { id: '1', legalName: 'Company A', scheme: 'GB-COH' },
      ],
    };
    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify(organisation)
    );
    component.ngOnInit();
    expect(component.routeParams).toEqual(params);
    expect(component.organisation).toEqual(organisation);
  });

  it('should navigate back when goBack method is called', () => {
    const navigateSpy = spyOn(component.router, 'navigateByUrl');
    component.routeParams = { scheme: 'example', id: '123' };
    component.goBack('Confirm organisation details');
    expect(navigateSpy).toHaveBeenCalledWith(
      `manage-org/register/search/${
        component.routeParams.scheme
      }?id=${encodeURIComponent(component.routeParams.id)}`
    );
  });

  it('should add or remove additionalIdentifier from selectedIdentifiers when onChange method is called', () => {
    const additionalIdentifier = {
      id: '1',
      legalName: 'Company A',
      scheme: 'GB-COH',
    };
    component.selectedIdentifiers = [];
    component.onChange(
      { currentTarget: { checked: true } },
      additionalIdentifier
    );
    expect(component.selectedIdentifiers).toContain(additionalIdentifier);
    component.onChange(
      { currentTarget: { checked: false } },
      additionalIdentifier
    );
    expect(component.selectedIdentifiers).not.toContain(additionalIdentifier);
  });

  it('should return the schema name based on the given schema code', () => {
    expect(component.getSchemaName('GB-COH')).toBe('Companies House');
    expect(component.getSchemaName('US-DUN')).toBe('Dun & Bradstreet');
    expect(component.getSchemaName('GB-CHC')).toBe(
      'Charities Commission for England and Wales'
    );
    expect(component.getSchemaName('GB-SC')).toBe(
      'Office of the Scottish Charity Regulator (OSCR)'
    );
    expect(component.getSchemaName('GB-NIC')).toBe(
      'Northern Ireland Charities Commission'
    );
    expect(component.getSchemaName('unknown-schema')).toBe('');
  });
});
