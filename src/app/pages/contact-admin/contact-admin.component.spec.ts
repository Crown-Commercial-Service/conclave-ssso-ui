import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactAdminComponent } from './contact-admin.component';
import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

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
        RouterTestingModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
      ],
      providers: [{ provide: Store, useFactory: () => ({}) }],
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
    const windowOpenSpy = spyOn(window, 'open');
    component.openEmailWindow(userData);
    expect(windowOpenSpy).toBeTruthy();
  });

  it('should set currentPage and call getOrganisationUsers when setPage is called', () => {
    spyOn(component, 'getOrganisationUsers');
    component.setPage(2);
    expect(component.currentPage).toBe(2);
    expect(component.getOrganisationUsers).toHaveBeenCalled();
  });

  it('should call window.history.back() when goBack is called', () => {
    const windowBackSpy = spyOn(window.history, 'back');
    component.goBack();
    expect(windowBackSpy).toHaveBeenCalled();
  });
});
