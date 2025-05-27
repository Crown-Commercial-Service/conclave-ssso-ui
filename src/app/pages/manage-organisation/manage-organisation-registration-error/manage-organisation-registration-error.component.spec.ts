import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ManageOrgRegErrorComponent } from './manage-organisation-registration-error.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ManageOrgRegErrorComponent', () => {
  let component: ManageOrgRegErrorComponent;
  let fixture: ComponentFixture<ManageOrgRegErrorComponent>;
  let mockStore: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    mockStore = jasmine.createSpyObj('Store', ['select']);
    mockStore.select.and.returnValue(of(false));

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [ManageOrgRegErrorComponent],
      providers: [{ provide: Store, useValue: mockStore }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the error message', () => {
    const errorMessage =
      fixture.nativeElement.querySelector('.govuk-body-l').textContent;
    expect(errorMessage).toContain(
      'This Organisation is already registered for Public Procurement Gateway.'
    );
  });

  it('should have a link to search with a different organization ID', () => {
    const link = fixture.nativeElement.querySelector(
      'a[routerLink="/manage-org/register/search"]'
    );
    expect(link).toBeTruthy();
  });

  it('should have a link to contact CCS', () => {
    const link = fixture.nativeElement.querySelector(
      'a[href="https://www.crowncommercial.gov.uk/contact"]'
    );
    expect(link).toBeTruthy();
  });
});
