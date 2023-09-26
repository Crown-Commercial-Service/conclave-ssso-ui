import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DelegatedUserListComponent } from './delegated-user-list.component';
import { environment } from 'src/environments/environment';

describe('DelegatedUserListComponent', () => {
  let component: DelegatedUserListComponent;
  let fixture: ComponentFixture<DelegatedUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [DelegatedUserListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegatedUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.searchText).toBe('');
    expect(component.searchSumbited).toBe(false);
    expect(component.tabConfig.currentusers).toBe(true);
    expect(component.tabConfig.expiredusers).toBe(false);
    expect(component.organisationId).toBe('');
    expect(component.currentUserstableConfig.currentPage).toBe(1);
    expect(component.currentUserstableConfig.pageCount).toBe(0);
    expect(component.currentUserstableConfig.pageSize).toBe(
      environment.listPageSize
    );
  });

  it('should call getOrganisationCurrentUsers and getOrganisationExpiredUsers on ngOnInit', () => {
    spyOn(component, 'getOrganisationCurrentUsers');
    spyOn(component, 'getOrganisationExpiredUsers');

    component.ngOnInit();

    expect(component.getOrganisationCurrentUsers).toHaveBeenCalled();
    expect(component.getOrganisationExpiredUsers).toHaveBeenCalled();
  });

  it('should navigate to find-delegated-user component on FindDelegateUser', () => {
    spyOn(component.router, 'navigateByUrl');

    component.FindDelegateUser();

    expect(component.router.navigateByUrl).toHaveBeenCalledWith(
      'find-delegated-user'
    );
  });

  it('should render the template correctly', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.page-title').textContent).toContain(
      'Delegated access'
    );
    expect(
      compiled.querySelector('.govuk-tabs__list-item--selected').textContent
    ).toContain('Current users with delegated access to your Organisation');
    expect(
      compiled.querySelector('.govuk-tabs__list-item:nth-child(2)').textContent
    ).toContain('Users with expired delegated access to your Organisation');
  });
});
