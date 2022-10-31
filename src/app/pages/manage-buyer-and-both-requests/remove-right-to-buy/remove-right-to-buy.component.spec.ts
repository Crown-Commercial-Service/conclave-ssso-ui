import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveRightToBuyComponent } from './remove-right-to-buy.component';

describe('RemoveRightToBuyComponent', () => {
  let component: RemoveRightToBuyComponent;
  let fixture: ComponentFixture<RemoveRightToBuyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveRightToBuyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveRightToBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
