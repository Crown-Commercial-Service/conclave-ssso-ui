import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { NominateComponent } from './nominate.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RollbarErrorService } from 'src/app/shared/rollbar-error.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { RollbarService, rollbarFactory } from 'src/app/logging/rollbar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

describe('NominateComponent', () => {
  let component: NominateComponent;
  let fixture: ComponentFixture<NominateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NominateComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ data: 'example-data' }),
          },
        },
        AuthService,
        RollbarErrorService,
        TokenService,
        { provide: RollbarService, useValue: rollbarFactory() },
        { provide: Store, useFactory: () => ({}) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NominateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form group', () => {
    expect(component.formGroup).toBeDefined();
    expect(component.formGroup.controls.firstName).toBeDefined();
    expect(component.formGroup.controls.lastName).toBeDefined();
    expect(component.formGroup.controls.email).toBeDefined();
  });

  it('should navigate to success page on form submission', () => {
    spyOn(component.router, 'navigateByUrl');
    component.onSubmit(component.formGroup);
    expect(component.router.navigateByUrl).toHaveBeenCalledWith(
      `nominate/success?data=${btoa(JSON.stringify(component.pageAccessMode))}`
    );
  });

  it('should set submitted to true on form submission', () => {
    component.onSubmit(component.formGroup);
    expect(component.submitted).toBeTrue();
  });
});
