import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserReactivateConfirmComponent } from './manage-user-reactivate-confirm.component';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('ManageUserReactivateConfirmComponent', () => {
  let component: ManageUserReactivateConfirmComponent;
  let fixture: ComponentFixture<ManageUserReactivateConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUserReactivateConfirmComponent ],
      imports:[
        StoreModule.forRoot({}),
        TranslateModule.forRoot(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserReactivateConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
