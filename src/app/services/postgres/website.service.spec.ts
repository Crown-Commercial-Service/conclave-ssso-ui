import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteService } from './website.service';

describe('WebsiteService', () => {
  let component: WebsiteService;
  let fixture: ComponentFixture<WebsiteService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebsiteService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsiteService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
