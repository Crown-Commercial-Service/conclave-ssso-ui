import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ContactAssignSelectionComponent } from './contact-assign-selection-component';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

describe('ContactAssignSelectionComponent', () => {
  let component: ContactAssignSelectionComponent;
  let fixture: ComponentFixture<ContactAssignSelectionComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
      declarations: [ContactAssignSelectionComponent],
      providers: [{ provide: Store, useFactory: () => ({}) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactAssignSelectionComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.selectionForm).toBeDefined();
    expect(component.selectionForm.get('selection')).toBeDefined();
  });

  it('navigate to site search', () => {
    spyOn(router, 'navigateByUrl');
    component.selectionForm.get('selection')?.setValue('siteContact');
    component.onSubmit(component.selectionForm);
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      'contact-assign/site-search?data=' +
        JSON.stringify({
          assigningSiteId: component.assigningSiteId,
          assigningOrgId: component.assigningOrgId,
          siteCreate: component.siteCreate,
        })
    );
  });
 
  it('navigate to site edit', () => {
    spyOn(router, 'navigateByUrl');
    component.onNavigateToSiteClick();
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      'manage-org/profile/site/edit?data=' +
        JSON.stringify({
          isEdit: true,
          siteId: component.assigningSiteId,
        })
    );
  });

  it('Cancel Click', () => {
    spyOn(window.history, 'back');
    component.onCancelClick();
    expect(window.history.back).toHaveBeenCalled();
  });
});

 