import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ManageOrgRegSearchStatusDuplicateComponent } from './manage-reg-organisation-status-duplicate.component';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('ManageOrgRegSearchStatusDuplicateComponent', () => {
  let component: ManageOrgRegSearchStatusDuplicateComponent;
  let fixture: ComponentFixture<ManageOrgRegSearchStatusDuplicateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageOrgRegSearchStatusDuplicateComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ManageOrgRegSearchStatusDuplicateComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize properties correctly', () => {
    expect(component.singleOrgExists).toBeFalse();
    expect(component.multipleOrgExists).toBeFalse();
    expect(component.orgNotExists).toBeFalse();
    expect(component.ciiOrgId).toBe('');
    expect(component.schemeName).toBe('');
  });

  it('should go back in history when goBack() is called', () => {
    spyOn(window.history, 'back');
    component.goBack();
    expect(window.history.back).toHaveBeenCalled();
  });
});
