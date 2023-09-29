import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import { JwPaginationComponent } from './pagination';

describe('JwPaginationComponent', () => {
  let component: JwPaginationComponent;
  let fixture: ComponentFixture<JwPaginationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [JwPaginationComponent]
    });
    fixture = TestBed.createComponent(JwPaginationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`initialPage has default value`, () => {
    expect(component.initialPage).toEqual(1);
  });

  it(`pageSize has default value`, () => {
    expect(component.pageSize).toEqual(10);
  });

  it(`maxPages has default value`, () => {
    expect(component.maxPages).toEqual(10);
  });

  describe('ngOnChanges', () => {
    it('makes expected calls', () => {
      const simpleChangesStub: SimpleChanges = <any>{};
      const spy1 = jest.spyOn(component, 'setPage');
      component.ngOnChanges(simpleChangesStub);
      expect(spy1).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const spy1 = jest.spyOn(component, 'setPage');
      component.ngOnInit();
      expect(spy1).toHaveBeenCalled();
    });
  });
});
