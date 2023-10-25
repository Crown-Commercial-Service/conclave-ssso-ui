import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { ManageOrgRegErrorGenericComponent } from './manage-organisation-registration-error-generic.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ManageOrgRegErrorGenericComponent', () => {
  let component: ManageOrgRegErrorGenericComponent;
  let fixture: ComponentFixture<ManageOrgRegErrorGenericComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StoreModule.forRoot({}),
        HttpClientTestingModule,
      ],
      declarations: [ManageOrgRegErrorGenericComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegErrorGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a link to search with a different organization ID', () => {
    const searchLink = fixture.nativeElement.querySelector(
      '#searchWithDifferentIdLink'
    );
    expect(searchLink.getAttribute('routerLink')).toBe(
      '/manage-org/register/search'
    );
  });

  it('should have a link to contact CCS', () => {
    const contactLink = fixture.nativeElement.querySelector('#submitClaimLink');
    expect(contactLink.getAttribute('href')).toBe(
      'https://www.crowncommercial.gov.uk/contact'
    );
    expect(contactLink.getAttribute('target')).toBe('_blank');
  });
});
