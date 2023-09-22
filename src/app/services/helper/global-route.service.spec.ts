import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalRouteService } from './global-route.service';

describe('GlobalRouteService', () => {
  let component: GlobalRouteService;
  let fixture: ComponentFixture<GlobalRouteService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalRouteService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalRouteService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
