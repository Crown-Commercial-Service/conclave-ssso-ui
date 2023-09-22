import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindyouradministratorComponent } from './find-your-administrator.component';

describe('FindyouradministratorComponent', () => {
  let component: FindyouradministratorComponent;
  let fixture: ComponentFixture<FindyouradministratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindyouradministratorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindyouradministratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
