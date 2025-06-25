import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DormancyMessageComponent } from './dormancy-message.component';
import { TranslateModule } from '@ngx-translate/core';

describe('DormancyMessageComponent', () => {
  let component: DormancyMessageComponent;
  let fixture: ComponentFixture<DormancyMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DormancyMessageComponent ],
      imports: [TranslateModule.forRoot()],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DormancyMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
