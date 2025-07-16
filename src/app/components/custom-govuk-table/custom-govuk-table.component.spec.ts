import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomGovukTableComponent } from './custom-govuk-table.component';
import { Store } from '@ngrx/store';

describe('CustomGovukTableComponent', () => {
  let component: CustomGovukTableComponent;
  let fixture: ComponentFixture<CustomGovukTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomGovukTableComponent],
      providers: [{ provide: Store, useFactory: () => ({}) }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomGovukTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
