import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenService } from './token.service';

describe('TokenService', () => {
  let component: TokenService;
  let fixture: ComponentFixture<TokenService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TokenService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
