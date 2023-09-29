import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { ViewportScroller } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BuyerDetailsComponent } from './details.component';
import { UIState } from 'src/app/store/ui.states';
import { ciiService } from 'src/app/services/cii/cii.service';
import { WrapperOrganisationService } from 'src/app/services/wrapper/wrapper-org-service';
import { SharedDataService } from 'src/app/shared/shared-data.service';

describe('BuyerDetailsComponent', () => {
  let component: BuyerDetailsComponent;
  let fixture: ComponentFixture<BuyerDetailsComponent>;
  let activatedRouteStub: Partial<ActivatedRoute>;
  let routerStub: Partial<Router>;
  let storeStub: Partial<Store<UIState>>;
  let viewportScrollerStub: Partial<ViewportScroller>;
  let ciiServiceStub: Partial<ciiService>;
  let organisationServiceStub: Partial<WrapperOrganisationService>;
  let sharedDataServiceStub: Partial<SharedDataService>;

  beforeEach(async () => {
    activatedRouteStub = {
      params: of({ id: '1' }),
    };
    routerStub = {
      navigateByUrl: jest.fn(),
    };
    storeStub = {};
    viewportScrollerStub = {};
    ciiServiceStub = {
      getSchemes: jest.fn().mockReturnValue(of([])),
      getOrgDetails: jest.fn().mockReturnValue(
        of({
          identifier: { scheme: 'GB-CCS', id: '123' },
          additionalIdentifiers: [
            { scheme: 'ABC', id: '456' },
            { scheme: 'XYZ', id: '789' },
          ],
        })
      ),
    };
    organisationServiceStub = {
      getOrganisation: jest.fn().mockReturnValue(
        of({
          identifier: { legalName: 'Test Org' },
          address: {
            streetAddress: '123 Street',
            locality: 'City',
            region: 'State',
            postalCode: '12345',
            countryName: 'Country',
          },
        })
      ),
    };
    sharedDataServiceStub = {
      getId: jest.fn().mockReturnValue('ABC-123'),
      convertIdToHyphenId: jest.fn().mockReturnValue('ABC-123'),
    };

    await TestBed.configureTestingModule({
      declarations: [BuyerDetailsComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: routerStub },
        { provide: Store, useValue: storeStub },
        { provide: ViewportScroller, useValue: viewportScrollerStub },
        { provide: ciiService, useValue: ciiServiceStub },
        {
          provide: WrapperOrganisationService,
          useValue: organisationServiceStub,
        },
        { provide: SharedDataService, useValue: sharedDataServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the organization details', () => {
    const orgDetails = fixture.debugElement.query(
      By.css('.content p')
    ).nativeElement;
    expect(orgDetails.textContent).toContain('Test Org');
    expect(orgDetails.textContent).toContain('123 Street');
    expect(orgDetails.textContent).toContain('City');
    expect(orgDetails.textContent).toContain('State');
    expect(orgDetails.textContent).toContain('12345');
    expect(orgDetails.textContent).toContain('Country');
  });

  it('should display the registries table', () => {
    const registriesTable = fixture.debugElement.query(
      By.css('.govuk-table')
    ).nativeElement;
    const rows = registriesTable.querySelectorAll('tbody tr');

    expect(rows.length).toBe(3); // One row for primary identifier and two rows for additional identifiers

    const primaryIdentifierRow = rows[0];
    const additionalIdentifierRow1 = rows[1];
    const additionalIdentifierRow2 = rows[2];

    expect(primaryIdentifierRow.textContent).toContain('GB-CCS');
    expect(primaryIdentifierRow.textContent).toContain('123');
    expect(primaryIdentifierRow.textContent).toContain('Primary');

    expect(additionalIdentifierRow1.textContent).toContain('ABC');
    expect(additionalIdentifierRow1.textContent).toContain('456');
    expect(additionalIdentifierRow1.textContent).toContain('');

    expect(additionalIdentifierRow2.textContent).toContain('XYZ');
    expect(additionalIdentifierRow2.textContent).toContain('789');
    expect(additionalIdentifierRow2.textContent).toContain('');
  });

  it('should navigate to the confirm page on continue button click', () => {
    const continueButton = fixture.debugElement.query(
      By.css('.govuk-button')
    ).nativeElement;
    continueButton.click();

    expect(routerStub.navigateByUrl).toHaveBeenCalledWith('buyer/confirm/1');
  });

  it('should navigate to the search page on cancel button click', () => {
    const cancelButton = fixture.debugElement.query(
      By.css('.govuk-button--secondary')
    ).nativeElement;
    cancelButton.click();

    expect(routerStub.navigateByUrl).toHaveBeenCalledWith('buyer/search');
  });
});
