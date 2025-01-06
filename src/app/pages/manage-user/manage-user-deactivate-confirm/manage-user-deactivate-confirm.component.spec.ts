import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserDeactivateConfirmComponent } from './manage-user-deactivate-confirm.component';
import { StoreModule } from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('ManageUserDeactivateConfirmComponent', () => {
  let component: ManageUserDeactivateConfirmComponent;
  let fixture: ComponentFixture<ManageUserDeactivateConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUserDeactivateConfirmComponent ],
      imports: [
        StoreModule.forRoot({}),
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserDeactivateConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
