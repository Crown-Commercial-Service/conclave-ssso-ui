import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactAdminComponent } from './contact-admin.component';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ContactAdminComponent', () => {
  let component: ContactAdminComponent;
  let fixture: ComponentFixture<ContactAdminComponent>;
  let wrapperOrganisationGroupService: jasmine.SpyObj<WrapperOrganisationGroupService>;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  
  beforeEach(async () => {
    const wrapperOrganisationGroupServiceSpy = jasmine.createSpyObj('WrapperOrganisationGroupService', ['getUsersAdmin']);

    await TestBed.configureTestingModule({
      declarations: [ContactAdminComponent],
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),  
        { provide: Store, useFactory: () => ({}) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactAdminComponent);
    component = fixture.componentInstance;
    wrapperOrganisationGroupService = TestBed.inject(WrapperOrganisationGroupService) as jasmine.SpyObj<WrapperOrganisationGroupService>;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set isOrgAdmin to true when localStorage has "isOrgAdmin" set to true', () => {
    localStorage.setItem('isOrgAdmin', 'true');
    component.ngOnInit();
    expect(component.isOrgAdmin).toBe(true);
  });

  it('should set isOrgAdmin to false when localStorage has "isOrgAdmin" set to false', () => {
    localStorage.setItem('isOrgAdmin', 'false');
    component.ngOnInit();
    expect(component.isOrgAdmin).toBe(false);
  });

  it('should call getOrganisationUsers on ngOnInit', () => {
    spyOn(component, 'getOrganisationUsers');
    component.ngOnInit();
    expect(component.getOrganisationUsers).toHaveBeenCalled();
  });

  it('should open email window when openEmailWindow is called', () => {
    const userData = { userName: 'test@example.com' };    
    spyOn(component, 'navigateToMailto');
    component.openEmailWindow(userData);    
    expect(component.navigateToMailto).toHaveBeenCalledWith('test@example.com');
  });

  it('should set currentPage and call getOrganisationUsers when setPage is called', () => {
    spyOn(component, 'getOrganisationUsers');
    component.setPage(2);
    expect(component.currentPage).toBe(2);
    expect(component.getOrganisationUsers).toHaveBeenCalled();
  });

  it('should call window.history.back() when goBack is called', () => {    
    const routerSpy = spyOn(component['router'], 'navigateByUrl');
    component.goBack('Back');
    expect(routerSpy).toHaveBeenCalledWith('profile');
  });
});
